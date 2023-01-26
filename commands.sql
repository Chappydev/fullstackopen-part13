CREATE TABLE blogs (id SERIAL PRIMARY KEY, author text, url text NOT NULL, title text NOT NULL, likes integer DEFAULT 0);

INSERT INTO blogs (author, url, title) VALUES ('Daniel C', 'website.com', 'Blog 1'), ('Guy', 'otherwebsite.ca', 'Blog 2');