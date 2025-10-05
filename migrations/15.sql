
-- Add debug information table to track database state
CREATE TABLE IF NOT EXISTS debug_info (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  table_name TEXT NOT NULL,
  record_count INTEGER NOT NULL,
  last_record_id INTEGER,
  check_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert current contact table state for debugging
INSERT INTO debug_info (table_name, record_count, last_record_id) 
SELECT 'contacts', COUNT(*), MAX(id) FROM contacts;
