CREATE TABLE users (
  user_id SERIAL PRIMARY KEY,                -- Changed from id to user_id
  name VARCHAR(100) NOT NULL,
  username VARCHAR(100) UNIQUE NOT NULL,     -- Changed from email to username
  password VARCHAR(100) NOT NULL,
  username_alias VARCHAR(100) UNIQUE NOT NULL, -- Renamed username to username_alias to avoid conflict
  mobile VARCHAR(15),                        -- Changed from mobile_number to mobile
  location VARCHAR(255),
  profile_photo TEXT
);

-- Other tables remain the same, but update references to users.user_id
CREATE TABLE linkedin_profiles (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  url VARCHAR(255) NOT NULL
);

CREATE TABLE education (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  start_year VARCHAR(50) NOT NULL,
  end_year VARCHAR(50) NOT NULL,
  board VARCHAR(255) NOT NULL,
  cgpa VARCHAR(50) NOT NULL,
  stream VARCHAR(255) NOT NULL,
  school VARCHAR(255) NOT NULL,
  website VARCHAR(255)
);

CREATE TABLE skills (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(255) NOT NULL
);

CREATE TABLE certifications (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  institute VARCHAR(255) NOT NULL,
  file_url TEXT
);

CREATE TABLE experiences (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  designation VARCHAR(255) NOT NULL,
  profile VARCHAR(255) NOT NULL,
  organization VARCHAR(255) NOT NULL,
  location VARCHAR(255) NOT NULL,
  start_date VARCHAR(50) NOT NULL,
  end_date VARCHAR(50) NOT NULL,
  role_type VARCHAR(50) NOT NULL CHECK (role_type IN ('Job', 'Internship'))
);

CREATE TABLE projects (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  link VARCHAR(255),
  description TEXT NOT NULL,
  role_and_tech TEXT NOT NULL
);

CREATE TABLE hobbies (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  UNIQUE (user_id, name)
);