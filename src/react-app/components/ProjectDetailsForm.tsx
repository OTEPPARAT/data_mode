import { useState } from 'react';
import { ArrowLeft, ArrowRight, FileText, Clock, Zap } from 'lucide-react';

interface ProjectDetailsFormProps {
  t: (key: string) => string;
  currentLang: 'th' | 'en';
  onNavigate: (section: string) => void;
  onNext: (projectData: ProjectFormData) => void;
}

export interface ProjectFormData {
  projectTitle: string;
  projectDescription: string;
  requirements: string;
  urgencyLevel: 'standard' | 'priority' | 'urgent';
  notes: string;
}

export default function ProjectDetailsForm({ onNavigate, onNext }: ProjectDetailsFormProps) {
  const [projectData, setProjectData] = useState<ProjectFormData>({
    projectTitle: '',
    projectDescription: '',
    requirements: '',
    urgencyLevel: 'standard',
    notes: ''
  });

  // Get selected package from localStorage
  const getSelectedPackage = () => {
    try {
      const stored = localStorage.getItem('selectedPackage');
      if (stored) {
        const parsed = JSON.parse(stored);
        return parsed.packageData;
      }
    } catch (error) {
      console.error('Error loading selected package:', error);
    }
    return null;
  };

  const selectedPackage = getSelectedPackage();

  const urgencyOptions = [
    {
      id: 'standard',
      name: 'ปกติ',
      description: `ตามระยะเวลาพื้นฐาน (${selectedPackage?.duration || '3-7 วัน'})`,
      multiplier: 1.0,
      badge: ''
    },
    {
      id: 'priority',
      name: 'เร่งด่วน',
      description: 'เร็วขึ้น 30-50% จากระยะเวลาปกติ (+25% ค่าบริการ)',
      multiplier: 1.25,
      badge: '+25%'
    },
    {
      id: 'urgent',
      name: 'เร่งด่วนมาก',
      description: 'เร็วที่สุด - ลดระยะเวลามากที่สุด (+50% ค่าบริการ)',
      multiplier: 1.5,
      badge: '+50%'
    }
  ];

  const handleNext = () => {
    if (!projectData.projectTitle || !projectData.projectDescription) {
      alert('กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน');
      return;
    }

    // Store project data
    localStorage.setItem('projectData', JSON.stringify(projectData));
    onNext(projectData);
  };

  if (!selectedPackage) {
    return (
      <div className="py-20 px-6 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 mb-4">ไม่พบข้อมูลแพ็คเกจที่เลือก</p>
          <button
            onClick={() => onNavigate('package-selection')}
            className="px-6 py-3 bg-cyan-500 text-white/80 font-thin rounded-lg hover:bg-cyan-600 transition-colors"
          >
            กลับไปเลือกแพ็คเกจ
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-20 px-6 min-h-screen">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => onNavigate('package-selection')}
            className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-gray-400 opacity-50" />
          </button>
          <div className="flex-1">
            <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-pink-500 bg-clip-text text-transparent">
              รายละเอียดโครงการ
            </h1>
            <p className="text-gray-300 mt-2">
              กรอกข้อมูลโครงการเพื่อให้ AI คำนวณราคาที่แม่นยำ
            </p>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center mb-12">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                ✓
              </div>
              <span className="ml-2 text-green-400 text-sm">เลือกแพ็คเกจ</span>
            </div>
            <div className="w-8 h-0.5 bg-cyan-500"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                2
              </div>
              <span className="ml-2 text-cyan-400 text-sm font-semibold">รายละเอียดโครงการ</span>
            </div>
            <div className="w-8 h-0.5 bg-gray-600"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-gray-400 text-sm font-bold">
                3
              </div>
              <span className="ml-2 text-gray-400 text-sm">ตรวจสอบใบสั่งซื้อ</span>
            </div>
            <div className="w-8 h-0.5 bg-gray-600"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-gray-400 text-sm font-bold">
                4
              </div>
              <span className="ml-2 text-gray-400 text-sm">ชำระเงิน</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <div className="space-y-8">
              {/* Project Information */}
              <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700">
                <h2 className="text-xl font-bold mb-6 text-cyan-400 flex items-center gap-2">
                  <FileText className="w-5 h-5 opacity-50" />
                  ข้อมูลโครงการ
                </h2>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-white">
                      ชื่อโครงการ *
                    </label>
                    <input
                      type="text"
                      value={projectData.projectTitle}
                      onChange={(e) => setProjectData({...projectData, projectTitle: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white"
                      placeholder="เช่น การวิเคราะห์ตลาดอสังหาริมทรัพย์ในกรุงเทพฯ"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-white">
                      รายละเอียดโครงการ *
                      <span className="text-xs text-cyan-400 ml-2">🤖 AI กำลังวิเคราะห์ราคา...</span>
                    </label>
                    <textarea
                      value={projectData.projectDescription}
                      onChange={(e) => setProjectData({...projectData, projectDescription: e.target.value})}
                      rows={6}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white resize-none"
                      placeholder="อธิบายรายละเอียดโครงการที่ต้องการให้วิเคราะห์อย่างละเอียด เช่น วัตถุประสงค์ของการวิเคราะห์ ข้อมูลที่ต้องการ ผลลัพธ์ที่คาดหวัง เป็นต้น (ยิ่งมีรายละเอียดมาก ระบบ AI จะคำนวณราคาได้แม่นยำขึ้น)"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-white">
                      ความต้องการเฉพาะ
                    </label>
                    <textarea
                      value={projectData.requirements}
                      onChange={(e) => setProjectData({...projectData, requirements: e.target.value})}
                      rows={4}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white resize-none"
                      placeholder="ความต้องการเฉพาะ เช่น การมุ่งเน้นเขตพื้นที่ใด ประเภทของข้อมูลที่ต้องการ รูปแบบการนำเสนอ หรือข้อจำกัดอื่นๆ"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-white">
                      หมายเหตุเพิ่มเติม
                    </label>
                    <textarea
                      value={projectData.notes}
                      onChange={(e) => setProjectData({...projectData, notes: e.target.value})}
                      rows={3}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white resize-none"
                      placeholder="หมายเหตุหรือข้อมูลเพิ่มเติมที่ต้องการแจ้ง..."
                    />
                  </div>
                </div>
              </div>

              {/* Urgency Level */}
              <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700">
                <h2 className="text-xl font-bold mb-6 text-purple-400 flex items-center gap-2">
                  <Clock className="w-5 h-5 opacity-50" />
                  ระดับความเร่งด่วน
                </h2>

                <div className="space-y-4">
                  {urgencyOptions.map((option) => (
                    <div
                      key={option.id}
                      onClick={() => setProjectData({...projectData, urgencyLevel: option.id as ProjectFormData['urgencyLevel']})}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 ${
                        projectData.urgencyLevel === option.id
                          ? 'border-purple-500 bg-purple-500/10'
                          : 'border-gray-600 bg-gray-700/50 hover:border-gray-500'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-3">
                            <h3 className="font-semibold text-white">{option.name}</h3>
                            {option.badge && (
                              <span className="bg-orange-500/20 text-orange-300 text-xs px-2 py-1 rounded-full font-medium">
                                {option.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-400 mt-1">{option.description}</p>
                        </div>
                        {projectData.urgencyLevel === option.id && (
                          <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                            <Zap className="w-4 h-4 text-white opacity-50" />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between">
                <button
                  onClick={() => onNavigate('package-selection')}
                  className="px-8 py-3 border border-gray-600 text-gray-300/80 font-thin rounded-lg hover:bg-gray-700 hover:text-white transition-all duration-300"
                >
                  กลับ
                </button>
                <button
                  onClick={handleNext}
                  disabled={!projectData.projectTitle || !projectData.projectDescription}
                  className="px-8 py-3 bg-gradient-to-r from-cyan-400 via-blue-500 to-pink-500 text-white/80 font-thin rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center gap-2"
                >
                  ดำเนินการต่อ
                  <ArrowRight className="w-5 h-5 opacity-50" />
                </button>
              </div>
            </div>
          </div>

          {/* Package Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700 sticky top-6">
              <h2 className="text-xl font-bold mb-6 text-cyan-400">
                แพ็คเกจที่เลือก
              </h2>

              <div className="bg-gray-900/50 rounded-lg p-4 mb-6">
                <h3 className="font-bold text-white mb-2 bg-gradient-to-r from-cyan-400 via-blue-500 to-pink-500 bg-clip-text text-transparent">{selectedPackage.name}</h3>
                <p className="text-sm text-gray-400 mb-3">
                  ประเภท: {selectedPackage.type === 'one_time' ? 'โครงการเดียว' : 'รายเดือน'}
                </p>
                <p className="text-sm text-gray-400 mb-4">
                  ระยะเวลามาตรฐาน: {selectedPackage.duration}
                </p>
                
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-300">คุณสมบัติ:</p>
                  {selectedPackage.features.map((feature: string, index: number) => (
                    <div key={index} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-sm text-gray-400">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                <p className="text-sm text-blue-300">
                  <strong>หมายเหตุ:</strong><br />
                  การกรอกรายละเอียดที่ชัดเจนจะช่วยให้ท่านได้คำตอบที่แม่นยำและเหมาะสมกับโครงการของคุณ โดยราคา ค่าบริการจะแปรผันตามรายละเอียด และความเร็วในการได้รับผลลัพธ์ส่งมอบงาน
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
