
-- Insert sample packages if they don't exist
INSERT OR IGNORE INTO packages (id, name, description, package_type, price_min, price_max, duration_days, features, data_sources, is_active, display_order) VALUES 
(1, 'Smart Researcher', 'ค้นหาและรวบรวมข้อมูลพื้นฐาน', 'one_time', 1500000, 3000000, 7, '["การค้นหาข้อมูลเบื้องต้น", "รายงานสรุปผล", "แหล่งข้อมูลที่เชื่อถือได้"]', '["Google Scholar", "PubMed", "Academic databases"]', 1, 1),
(2, 'Data Commander', 'วิเคราะห์ข้อมูลเชิงลึก', 'one_time', 3000000, 5000000, 14, '["การวิเคราะห์เชิงลึก", "แนวโน้มและรูปแบบ", "ข้อเสนอแนะเชิงกลยุทธ์"]', '["Professional databases", "Industry reports", "Market research"]', 1, 2),
(3, 'Intelligence Prime', 'การวิเคราะห์ระดับผู้เชี่ยวชาญ', 'monthly', 5000000, 10000000, 30, '["การวิเคราะห์ระดับผู้เชี่ยวชาญ", "รายงานประจำเดือน", "การปรึกษาออนไลน์"]', '["Premium databases", "Expert interviews", "Custom research"]', 1, 3);
