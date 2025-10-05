
-- Insert sample video data
INSERT INTO videos (title, description, filename, file_size, content_type, r2_key, duration, is_published) 
VALUES 
(
  'TEST1 EX', 
  'วิดีโอแสดงขั้นตอนการทำงานของ Super AI Agent ในการค้นหาและวิเคราะห์ข้อมูล', 
  'test1-ex-demo.mp4', 
  15728640, 
  'video/mp4', 
  'videos/sample-test1-ex.mp4', 
  120, 
  1
),
(
  'DATA MODE Work System Demo', 
  'ตัวอย่างการทำงานของระบบ DATA MODE Super AI Agent', 
  'datamode-demo.mp4', 
  22015360, 
  'video/mp4', 
  'videos/sample-datamode-demo.mp4', 
  180, 
  1
),
(
  'Super AI Agent Tutorial', 
  'คู่มือการใช้งาน Super AI Agent สำหรับการวิเคราะห์ข้อมูล', 
  'tutorial-video.mp4', 
  31457280, 
  'video/mp4', 
  'videos/sample-tutorial.mp4', 
  240, 
  1
);
