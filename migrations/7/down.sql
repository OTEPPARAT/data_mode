
-- Remove sample video data
DELETE FROM videos WHERE r2_key IN (
  'videos/sample-test1-ex.mp4',
  'videos/sample-datamode-demo.mp4', 
  'videos/sample-tutorial.mp4'
);
