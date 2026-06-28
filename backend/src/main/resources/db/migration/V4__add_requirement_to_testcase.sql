ALTER TABLE test_cases ADD COLUMN requirement_id TEXT REFERENCES requirements(id);
