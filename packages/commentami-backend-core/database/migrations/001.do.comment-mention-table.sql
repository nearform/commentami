CREATE TABLE comment (
  id SERIAL PRIMARY KEY,
  resource varchar(2048) NOT NULL,
  reference varchar(512) NOT NULL,
  content text NOT NULL,
  author varchar(255) NULL,
  created_at timestamp with time zone NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS comment_resource_index ON comment (resource);
CREATE INDEX IF NOT EXISTS comment_resource_reference_index ON comment (resource, reference);

CREATE TABLE mention (
  id SERIAL PRIMARY KEY,
  comment_id INTEGER NOT NULL REFERENCES comment (id) ON DELETE CASCADE,
  mentioned varchar(255) NOT NULL
);
