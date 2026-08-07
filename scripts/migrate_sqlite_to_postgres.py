import sqlite3
import psycopg2
from psycopg2 import sql

sqlite_db = "data/suzanoit-qa.db"
pg_conn_str = "host=localhost port=5432 user=postgres password=postgres dbname=suzanoit_qa"

def migrate():
    print("Connecting to SQLite...")
    sl_conn = sqlite3.connect(sqlite_db)
    sl_cur = sl_conn.cursor()

    print("Connecting to PostgreSQL...")
    pg_conn = psycopg2.connect(pg_conn_str)
    pg_cur = pg_conn.cursor()

    # Get all tables from PostgreSQL
    pg_cur.execute("SELECT tablename FROM pg_tables WHERE schemaname='public';")
    pg_tables = [row[0] for row in pg_cur.fetchall()]

    # Get all tables from SQLite
    sl_cur.execute("SELECT name FROM sqlite_master WHERE type='table';")
    tables = [row[0] for row in sl_cur.fetchall() if row[0] not in ('sqlite_sequence', 'flyway_schema_history') and row[0] in pg_tables]

    # Disable all triggers in Postgres to avoid Foreign Key issues during migration
    for table in tables:
        print(f"Disabling triggers for {table}...")
        pg_cur.execute(sql.SQL("ALTER TABLE {} DISABLE TRIGGER ALL;").format(sql.Identifier(table)))
    pg_conn.commit()

    for table in tables:
        print(f"Migrating table: {table}")
        sl_cur.execute(f"SELECT * FROM {table}")
        rows = sl_cur.fetchall()

        if not rows:
            print(f"  No data in {table}.")
            continue

        # Get column names
        col_names = [description[0] for description in sl_cur.description]
        
        # Prepare Postgres insert
        # SQLite might have boolean as 0/1, Postgres expects true/false or boolean type
        # But psycopg2 handles integers for booleans reasonably if cast, or we can just pass them.
        
        insert_query = sql.SQL("INSERT INTO {} ({}) VALUES ({}) ON CONFLICT DO NOTHING").format(
            sql.Identifier(table),
            sql.SQL(', ').join(map(sql.Identifier, col_names)),
            sql.SQL(', ').join(sql.Placeholder() * len(col_names))
        )

        try:
            # Psycopg2 execute_many is not as fast as execute_batch but works
            from psycopg2.extras import execute_batch
            execute_batch(pg_cur, insert_query, rows)
            print(f"  Migrated {len(rows)} rows for {table}.")
        except Exception as e:
            print(f"  Error migrating {table}: {e}")
            pg_conn.rollback()
            continue

    # Re-enable triggers
    for table in tables:
        print(f"Enabling triggers for {table}...")
        pg_cur.execute(sql.SQL("ALTER TABLE {} ENABLE TRIGGER ALL;").format(sql.Identifier(table)))

    pg_conn.commit()
    print("Migration complete!")
    sl_conn.close()
    pg_conn.close()

if __name__ == "__main__":
    migrate()
