
-- Remove test packages (only if they were added by this migration)
DELETE FROM packages WHERE id IN (1, 2, 3, 4, 5) AND display_order <= 5;
