
-- Drop old tables if they exist (for resetting)
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS candidates CASCADE; -- Cascade to drop dependent tables first
DROP TABLE IF EXISTS votes CASCADE;

-- 🧍 Users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password TEXT, -- For JWT authentication
  is_admin BOOLEAN DEFAULT FALSE
);

-- 🗳️ Candidates table
CREATE TABLE candidates (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  picture_url VARCHAR(255)  
);

-- 🗳️ Votes table
CREATE TABLE votes (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  candidate_id INT REFERENCES candidates(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id) -- Ensures one vote per user
);

-- 👥 Sample users (passwords will be hashed upon registration/seed)
-- UPDATE: Use INSERT with hashed password or hash on registration. For simplicity in init.sql, we'll insert raw data and assume you'll hash it for real use.
INSERT INTO users (id, name, email, is_admin) VALUES
(1, 'Alice Johnson', 'alice@example.com', TRUE),
(2, 'Bob Smith', 'bob@example.com', FALSE);

-- 🧑‍💼 Sample candidates
INSERT INTO candidates (name, description) VALUES
('Greg Redd', 'Our charismatic colleague and team motivator.'),
('Sally Smith', 'Always reliable and great with clients.');

-- Reset sequence for id to match inserted values
SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));
SELECT setval('candidates_id_seq', (SELECT MAX(id) FROM candidates));