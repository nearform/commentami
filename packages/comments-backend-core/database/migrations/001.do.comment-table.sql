CREATE TABLE comment (
  id SERIAL PRIMARY KEY,
  resource varchar(2048) NOT NULL,
  reference varchar(512) NOT NULL,
  content text NOT NULL,
  author varchar(255) NULL,
  created_at timestamp with time zone NOT NULL DEFAULT NOW()
);
