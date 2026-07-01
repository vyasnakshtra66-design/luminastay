-- ================================================================
-- DATABASE SCHEMA FOR LOGIN SYSTEM
-- ================================================================
-- Run this file to create the database and table:
--   mysql -u root -p < schema.sql
--
-- Or in MySQL command line:
--   SOURCE schema.sql;
-- ================================================================

CREATE DATABASE IF NOT EXISTS login_app
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;
-- utf8mb4 supports emojis and special characters
-- utf8mb4_unicode_ci handles case-insensitive sorting correctly

USE login_app;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    -- AUTO_INCREMENT: Each new user gets next number (1, 2, 3...)
    -- PRIMARY KEY: Fast lookup, no duplicates

    username VARCHAR(50) UNIQUE NOT NULL,
    -- VARCHAR(50): Max 50 characters
    -- UNIQUE: No two users can have same username
    -- NOT NULL: Must provide a value

    email VARCHAR(100) UNIQUE NOT NULL,
    -- Cannot have two users with same email
    -- 100 chars is plenty for email addresses

    password_hash VARCHAR(255) NOT NULL,
    -- bcrypt hash is 60 chars, but we allocate 255 for future-proofing
    -- Future algorithms may produce longer hashes

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    -- TIMESTAMP: Stores date and time
    -- DEFAULT CURRENT_TIMESTAMP: Auto-filled when row is inserted
    -- User doesn't need to provide this value
);

-- ================================================================
-- USEFUL QUERIES
-- ================================================================

-- View all users:
-- SELECT id, username, email, created_at FROM users;

-- Find user by email:
-- SELECT * FROM users WHERE email = 'user@example.com';

-- Check if username exists:
-- SELECT id FROM users WHERE username = 'john';

-- Delete a user:
-- DELETE FROM users WHERE id = 1;

-- Count total users:
-- SELECT COUNT(*) FROM users;
