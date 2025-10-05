-- ลบ packages ที่ซ้ำกัน เหลือเฉพาะชุดล่าสุด
DELETE FROM packages WHERE id NOT IN (
  SELECT id FROM (
    SELECT MAX(id) as id 
    FROM packages 
    GROUP BY name, package_type
  ) as latest
);

-- อัพเดท price ให้เป็น satang (หน่วยเงินที่ถูกต้อง)
UPDATE packages SET 
  price_min = CASE 
    WHEN name = 'Smart Researcher' THEN 2000000  -- 20,000 บาท = 2,000,000 สตางค์
    WHEN name = 'Data Commander' THEN 4500000   -- 45,000 บาท = 4,500,000 สตางค์  
    WHEN name = 'Intelligence Prime' THEN 7500000 -- 75,000 บาท = 7,500,000 สตางค์
    WHEN name = 'Trend Observer' THEN 2500000   -- 25,000 บาท = 2,500,000 สตางค์
    WHEN name = 'Visual Insights' THEN 5000000  -- 50,000 บาท = 5,000,000 สตางค์
  END,
  price_max = CASE 
    WHEN name = 'Smart Researcher' THEN 4000000  -- 40,000 บาท
    WHEN name = 'Data Commander' THEN 7500000   -- 75,000 บาท
    WHEN name = 'Intelligence Prime' THEN 25000000 -- 250,000 บาท
    WHEN name = 'Trend Observer' THEN 9500000   -- 95,000 บาท
    WHEN name = 'Visual Insights' THEN 15000000 -- 150,000 บาท
  END;