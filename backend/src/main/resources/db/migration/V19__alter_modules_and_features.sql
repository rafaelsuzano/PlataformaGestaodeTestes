INSERT OR IGNORE INTO projects (id, name, description, status, created_at, updated_at) 
VALUES ('GLOBAL', 'Configurações Globais', 'Projeto interno para configurações globais da plataforma', 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

ALTER TABLE features ADD COLUMN category_id TEXT;
ALTER TABLE features ADD COLUMN code TEXT;
ALTER TABLE features ADD COLUMN objective TEXT;
ALTER TABLE features ADD COLUMN status TEXT;
ALTER TABLE features ADD COLUMN priority TEXT;
ALTER TABLE features ADD COLUMN version TEXT;
ALTER TABLE features ADD COLUMN permissions TEXT;
ALTER TABLE features ADD COLUMN dependencies TEXT;
ALTER TABLE features ADD COLUMN tags TEXT;
ALTER TABLE features ADD COLUMN icon_name TEXT;
ALTER TABLE features ADD COLUMN color TEXT;
ALTER TABLE features ADD COLUMN menu_order INTEGER DEFAULT 0;
ALTER TABLE features ADD COLUMN url TEXT;
ALTER TABLE features ADD COLUMN visible_in_menu BOOLEAN DEFAULT 1;
ALTER TABLE features ADD COLUMN show_in_dashboard BOOLEAN DEFAULT 1;
