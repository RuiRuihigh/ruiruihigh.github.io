CREATE TABLE IF NOT EXISTS links (
  code TEXT PRIMARY KEY,
  label TEXT NOT NULL,
  path TEXT NOT NULL,
  active INTEGER NOT NULL DEFAULT 1,
  created_at INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS visits (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  code TEXT NOT NULL REFERENCES links(code),
  path TEXT NOT NULL,
  bucket INTEGER NOT NULL,
  session_hash TEXT NOT NULL,
  visited_at INTEGER NOT NULL,
  UNIQUE(code, path, bucket, session_hash)
);
CREATE INDEX IF NOT EXISTS visits_code_time ON visits(code, visited_at);
CREATE INDEX IF NOT EXISTS visits_time ON visits(visited_at);
CREATE TABLE IF NOT EXISTS login_limits (id INTEGER PRIMARY KEY CHECK(id = 1), bucket INTEGER NOT NULL, attempts INTEGER NOT NULL);
