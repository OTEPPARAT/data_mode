
-- Remove test data
DELETE FROM projects WHERE id IN (1, 2);
DELETE FROM orders WHERE id IN (1, 2);
DELETE FROM users WHERE id = 1;
DELETE FROM packages WHERE id IN (1, 2, 3, 4, 5);
