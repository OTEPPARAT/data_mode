
-- Remove sample data (optional, for rollback)
DELETE FROM packages WHERE id IN (1, 2, 3, 4, 5);
DELETE FROM users WHERE id = 1 AND email = 'demo@datamode.com';
