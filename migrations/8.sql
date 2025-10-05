
ALTER TABLE users ADD COLUMN member_id TEXT;
CREATE UNIQUE INDEX idx_users_member_id ON users(member_id);
