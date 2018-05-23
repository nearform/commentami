CREATE TABLE comment (
  id SERIAL PRIMARY KEY,
  reference varchar(512) NOT NULL,
  content text NOT NULL,
  author varchar(255) NOT NULL
);
