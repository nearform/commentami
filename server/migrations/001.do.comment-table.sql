CREATE TABLE comment (
  id SERIAL PRIMARY KEY,
  reference varchar(512) NOT NULL,
  comment text NOT NULL,
  author varchar(255) NOT NULL
);
