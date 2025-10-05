
DELETE FROM projects WHERE user_id IN (1, 2);
DELETE FROM orders WHERE user_id IN (1, 2);
DELETE FROM users WHERE email IN ('test@example.com', 'demo@datamode.com');
