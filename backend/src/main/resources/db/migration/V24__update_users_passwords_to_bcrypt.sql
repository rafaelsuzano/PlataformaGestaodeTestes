-- V24: Update existing users passwords to a BCrypt hash (admin123)
-- This is necessary so the existing migrated users can login via Spring Security

UPDATE users SET password = '$2b$12$0y9ueyzD1EHHiMkOtuxzquOvI7aYsOxw8C3PzlrLuuY1zb9cKyB6K';
