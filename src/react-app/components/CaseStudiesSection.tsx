interface CaseStudiesSectionProps {
  t: (key: string) => string;
  currentLang: 'th' | 'en';
  onNavigate?: (section: string) => void;
}

export default function CaseStudiesSection({ t, currentLang, onNavigate }: CaseStudiesSectionProps) {
  const cases = [
    {
      title: 'GreenEnergy Co. — การขยายตลาดพลังงานสะอาด',
      industry: 'Clean Energy',
      challenge: 'ระบุประเทศในอาเซียนที่มีความพร้อมด้านพลังงานหมุนเวียน',
      solution: 'วิเคราะห์ฐานข้อมูลนโยบาย, รายงานอุตสาหกรรม, ข่าวธุรกิจ และสิทธิประโยชน์ด้านการลงทุน',
      delivery: 'รายงานการจัดอันดับ 5 ประเทศ, ปัจจัยสนับสนุน/ข้อจำกัดหลัก, แผนที่โอกาสเชิงเปรียบเทียบ',
      result: 'ช่วยย่นระยะเวลาวิจัยเบื้องต้นลง 70–85% และให้ short list ประเทศที่ควรเจาะเชิงกลยุทธ์ (ไม่ใช่การรับประกันผลสำเร็จในการลงทุน)',
      titleEn: 'GreenEnergy Co. — Regional Expansion',
      industryEn: 'Clean Energy',
      challengeEn: 'Identify ASEAN countries most suitable for renewable energy projects.',
      solutionEn: 'AI Agent analyzes policy databases, industry reports, investment incentives, and energy news.',
      deliveryEn: 'Ranked list of 5 countries, key opportunities/constraints, comparative opportunity map.',
      resultEn: 'Reduce research time by 70–85% and highlight top countries for further exploration (illustrative only).'
    },
    {
      title: 'ShopChain — การปรับสินค้าในสาขา',
      industry: 'Retail',
      challenge: 'เพิ่มยอดขายต่อพื้นที่โดยเลือกสินค้าที่เหมาะกับพฤติกรรมผู้บริโภคแต่ละสาขา',
      solution: 'รวมข้อมูล POS, Loyalty, ประชากรท้องถิ่น และรีวิวสินค้า เพื่อสร้างโมเดล clustering และ demand scoring',
      delivery: 'รายงาน insight per store cluster, รายการสินค้าที่มีศักยภาพสูง, การคาดการณ์แนวโน้มยอดขาย 3 เดือน',
      result: 'สาขาที่ปรับตามคำแนะนำอาจเห็นยอดขายเพิ่ม ~8–20% และลดสต็อกตาย ~10–25% (เป็นเพียงการประมาณการเชิงสมมติ)',
      titleEn: 'ShopChain — Store-level Assortment',
      industryEn: 'Retail',
      challengeEn: 'Increase sales per square meter by tailoring assortments.',
      solutionEn: 'Combine POS, loyalty, demographics, search keywords, and product reviews to cluster stores and score demand.',
      deliveryEn: 'Store cluster insights, top-N SKU candidate lists, 3-month sales forecasts.',
      resultEn: 'Pilot stores may achieve ~8–20% sales uplift and ~10–25% dead-stock reduction (illustrative, dependent on client adoption).'
    },
    {
      title: 'EComNow — การเพิ่ม Conversion',
      industry: 'E-commerce',
      challenge: 'Cart abandonment สูงในผู้ใช้ใหม่',
      solution: 'วิเคราะห์ funnel, รีวิวสินค้า, heatmap การใช้งานเพื่อตรวจหาคอขวด',
      delivery: 'รายงาน root-cause, insight เกี่ยวกับพฤติกรรมผู้ใช้, ชุดข้อเสนอสำหรับการทดลอง (hypotheses + metrics ที่ควรวัด)',
      result: 'หากมีการนำไปใช้ อาจเพิ่ม conversion ได้ ~10–30% ในกลุ่มทดลอง (ขึ้นกับ traffic และงบประมาณ)',
      titleEn: 'EComNow — Conversion Optimization',
      industryEn: 'E-commerce',
      challengeEn: 'High cart abandonment among new users.',
      solutionEn: 'Funnel, product reviews, and behavior analysis to identify bottlenecks.',
      deliveryEn: 'Root-cause report, behavior insights, testing hypotheses with measurement framework.',
      resultEn: 'Possible ~10–30% conversion uplift in pilot groups (illustrative, varies with traffic and budget).'
    },
    {
      title: 'NutraHealth — การเปิดตัวผลิตภัณฑ์ใหม่',
      industry: 'FMCG',
      challenge: 'ต้องการค้นหาความต้องการที่ยังไม่ได้รับการตอบสนอง',
      solution: 'วิเคราะห์ social listening, เทรนด์ค้นหา, ข้อมูลรีวิว เพื่อระบุ pain point และ benefit ที่ผู้บริโภคต้องการ',
      delivery: 'Consumer Insight Report, คอนเซ็ปต์ผลิตภัณฑ์ที่ผ่านการประเมินเบื้องต้น, กรอบการวัดผลนำร่อง',
      result: 'อัตราความตั้งใจซื้ออาจสูงขึ้น 20–40% ในกลุ่มทดสอบ (ตัวเลขขึ้นกับคุณภาพข้อมูลและขนาดตัวอย่าง)',
      titleEn: 'NutraHealth — New Product Launch',
      industryEn: 'FMCG',
      challengeEn: 'Identify unmet consumer needs.',
      solutionEn: 'Social listening, search trends, review clustering.',
      deliveryEn: 'Consumer Insight Report, validated product concepts, pilot measurement framework.',
      resultEn: '20–40% higher purchase intent in test groups (illustrative, dependent on sample quality).'
    },
    {
      title: 'FinServe — การลด Churn',
      industry: 'Fintech',
      challenge: 'ลูกค้า SME ยกเลิกบริการสูง',
      solution: 'วิเคราะห์การใช้งาน, support tickets, และสัญญาณภายนอกเพื่อสร้าง churn driver analysis',
      delivery: 'รายงานกลุ่มลูกค้าเสี่ยง, ปัจจัยหลักที่ทำให้ churn, ตัวเลือกแนวทางแก้ไข',
      result: 'หากใช้กลยุทธ์ที่แนะนำสม่ำเสมอ อัตรา churn อาจลดลง 15–35% (ไม่ใช่การรับประกัน)',
      titleEn: 'FinServe — Churn Reduction',
      industryEn: 'Fintech',
      challengeEn: 'High churn among SME clients.',
      solutionEn: 'Usage, support, and external signals analyzed for churn drivers.',
      deliveryEn: 'Risk segmentation, churn drivers, strategic intervention options.',
      resultEn: 'Possible 15–35% churn reduction with consistent adoption (illustrative).'
    },
    {
      title: 'HealthSupp Co. — การวิเคราะห์ Sentiment & ความเสี่ยงกฎระเบียบ',
      industry: 'Healthcare',
      challenge: 'ประเมินความรู้สึกผู้บริโภคต่อส่วนประกอบใหม่ และความเสี่ยงกฎหมายในตลาดเป้าหมาย',
      solution: 'วิเคราะห์ฐานข้อมูลวิชาการ, ข้อมูลกฎระเบียบ, forum และรีวิวสินค้า',
      delivery: 'รายงาน Risk & Opportunity, แผนที่ sentiment ต่อประเทศ, รายการประเด็นเสี่ยง',
      result: 'ลดความเสี่ยง PR/regulatory โดยการเตรียมตัวล่วงหน้า 2–4 สัปดาห์',
      titleEn: 'HealthSupp Co. — Sentiment & Regulatory Risks',
      industryEn: 'Healthcare',
      challengeEn: 'Gauge sentiment and regulatory risks for new ingredients.',
      solutionEn: 'Scientific, regulatory, forum, and review analysis.',
      deliveryEn: 'Risk & Opportunity Report, sentiment heatmap, flagged issues list.',
      resultEn: 'Earlier detection of PR/regulatory risks by 2–4 weeks (illustrative).'
    },
    {
      title: 'ManuParts — การวิเคราะห์ความเสี่ยงซัพพลายเชน',
      industry: 'Manufacturing',
      challenge: 'ความไม่แน่นอนของ supplier หลัก',
      solution: 'รวมข้อมูล supplier performance, ข่าว, ราคาวัตถุดิบ เพื่อสร้าง risk score',
      delivery: 'รายงาน Supplier Risk, ปัจจัยเสี่ยงสำคัญ, ทางเลือกเชิงหลักการ',
      result: 'ลดความผันผวน lead time ลง 20–50% หากลูกค้านำข้อเสนอไปปรับใช้จริง',
      titleEn: 'ManuParts — Supply Chain Risks',
      industryEn: 'Manufacturing',
      challengeEn: 'Supplier instability threatens operations.',
      solutionEn: 'Supplier performance, raw material prices, and news sentiment analysis.',
      deliveryEn: 'Supplier risk report, key risk factors, strategic options.',
      resultEn: '20–50% reduced volatility in lead times if applied (illustrative).'
    },
    {
      title: 'UniLearn — การเพิ่มผู้สมัครเรียน',
      industry: 'Education',
      challenge: 'ต้องการเพิ่มนักศึกษาสำหรับโปรแกรมใหม่',
      solution: 'วิเคราะห์ demographic, online trends, search data และ competitor positioning',
      delivery: 'รายงาน audience insights, ข้อเสนอ messaging, การคาดการณ์ CPL ranges',
      result: 'CPL อาจลดลง 10–40% และอัตรา conversion เพิ่มขึ้น 15–30% ในการทดสอบนำร่อง',
      titleEn: 'UniLearn — Enrollment Growth',
      industryEn: 'Education',
      challengeEn: 'Increase applications for a new program.',
      solutionEn: 'Analyze demographics, trends, competitor positioning, and search data.',
      deliveryEn: 'Audience insight report, messaging recommendations, CPL forecasts.',
      resultEn: 'CPL may decrease 10–40% and conversion increase 15–30% in pilots (illustrative).'
    },
    {
      title: 'PublicAgency — การติดตามประเด็นสาธารณะ',
      industry: 'Government',
      challenge: 'ต้องการตรวจจับสัญญาณ sentiment สาธารณะก่อนเกิดปัญหาใหญ่',
      solution: 'ติดตาม social listening, ข่าวท้องถิ่น, ข้อมูลเปิดภาครัฐ',
      delivery: 'รายงาน Early Warning, แผนที่ประเด็น, Scenario options',
      result: 'ตรวจพบประเด็นได้เร็วขึ้น 1–3 สัปดาห์ ช่วยเพิ่มเวลาการตอบสนอง',
      titleEn: 'PublicAgency — Public Sentiment Monitoring',
      industryEn: 'Government',
      challengeEn: 'Detect early warning signals of emerging social/policy issues.',
      solutionEn: 'Social listening, local news, government open data monitoring.',
      deliveryEn: 'Early Warning Report, issue maps, scenario outlines.',
      resultEn: '1–3 weeks earlier detection, enabling faster response (illustrative).'
    },
    {
      title: 'TravelStay — Demand Forecast',
      industry: 'Hospitality',
      challenge: 'ความผันผวนความต้องการในธุรกิจท่องเที่ยว/โรงแรม',
      solution: 'วิเคราะห์ข้อมูลจอง, เทรนด์ค้นหา, event calendar และปัจจัยสภาพอากาศ',
      delivery: 'รายงานการคาดการณ์ 30 วัน, ขอบเขตราคาเชิงวิเคราะห์, ผล back-test',
      result: 'RevPAR อาจเพิ่มขึ้น 3–12% หากลูกค้านำข้อเสนอไปใช้จริง',
      titleEn: 'TravelStay — Demand Forecasting',
      industryEn: 'Hospitality',
      challengeEn: 'Volatile demand due to seasonality and events.',
      solutionEn: 'Booking history, search trends, event calendars, and weather analysis.',
      deliveryEn: '30-day demand forecast, analytical price ranges, back-test results.',
      resultEn: 'Possible 3–12% RevPAR increase if recommendations are adopted (illustrative).'
    }
  ];

  return (
    <div className="py-20 px-6">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-pink-500 bg-clip-text text-transparent">
              {t('cases-title')}
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-4xl mx-auto">
            {t('cases-subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {cases.map((caseStudy, index) => (
            <div key={index} className="p-6 bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 hover:border-cyan-500/50 transition-all duration-500 hover:shadow-xl hover:shadow-cyan-500/10">
              <div className="mb-4">
                <h3 className="text-xl font-bold mb-2 bg-gradient-to-r from-cyan-400 via-blue-500 to-pink-500 bg-clip-text text-transparent">
                  {currentLang === 'th' ? caseStudy.title : caseStudy.titleEn}
                </h3>
                <span className="text-xs px-3 py-1 bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 rounded-full border border-purple-500/30">
                  {currentLang === 'th' ? caseStudy.industry : caseStudy.industryEn}
                </span>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2 text-white/80 text-sm">
                    {currentLang === 'th' ? 'ความท้าทาย:' : 'Challenge:'}
                  </h4>
                  <p className="text-gray-300 text-xs leading-relaxed">
                    {currentLang === 'th' ? caseStudy.challenge : caseStudy.challengeEn}
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2 text-white/80 text-sm">
                    {currentLang === 'th' ? 'วิธีแก้ไข (AI Agent):' : 'Solution:'}
                  </h4>
                  <p className="text-gray-300 text-xs leading-relaxed">
                    {currentLang === 'th' ? caseStudy.solution : caseStudy.solutionEn}
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2 text-white/80 text-sm">
                    {currentLang === 'th' ? 'การส่งมอบ:' : 'Deliverables:'}
                  </h4>
                  <p className="text-gray-300 text-xs leading-relaxed">
                    {currentLang === 'th' ? caseStudy.delivery : caseStudy.deliveryEn}
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2 text-white/80 text-sm">
                    {currentLang === 'th' ? 'ผลลัพธ์ที่คาดหวัง:' : 'Expected Results:'}
                  </h4>
                  <p className="text-gray-300 text-xs leading-relaxed">
                    {currentLang === 'th' ? caseStudy.result : caseStudy.resultEn}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Disclaimer Section */}
        <div className="mt-16 p-8 bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold mb-6 text-white/80">
              🔹 {currentLang === 'th' ? 'หมายเหตุสำหรับการใช้งานเว็บไซต์' : 'Disclaimer'}
            </h3>
          </div>
          
          <div className="space-y-6 text-gray-300">
            {currentLang === 'en' ? (
              <div className="p-6 bg-gray-700/50 rounded-xl">
                <p className="text-sm leading-relaxed">
                  The figures, results, and percentages presented in these simulated cases are illustrative estimates only, based on assumptions and available data. Actual results may vary depending on data quality, implementation conditions, budget allocation, and client adoption. The company also complies with ethical standards and relevant laws such as PDPA and local data protection regulations in each jurisdiction.
                </p>
              </div>
            ) : (
              <div className="p-6 bg-gray-700/50 rounded-xl">
                <p className="text-sm leading-relaxed">
                  ตัวเลข ผลลัพธ์ และเปอร์เซ็นต์ที่ปรากฏในเอกสารหรือกรณีจำลองทั้งหมด เป็นเพียง การประมาณการเชิงสมมติ โดยอ้างอิงจากข้อมูลและสมมติฐานที่เพียงพอ ผลลัพธ์จริงอาจแตกต่างไปตามคุณภาพข้อมูล เงื่อนไขการดำเนินงาน การจัดสรรงบประมาณ และการนำไปใช้จริง
                </p>
                <p className="text-sm leading-relaxed mt-3">
                  ทั้งนี้ บริษัทจะดำเนินการตามมาตรฐานจริยธรรมและกฎหมายที่เกี่ยวข้อง เช่น PDPA และกฎหมายคุ้มครองข้อมูลส่วนบุคคลในแต่ละพื้นที่
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-16 text-center">
          <p className="text-lg text-gray-300 mb-6">
            {currentLang === 'th' 
              ? 'ผลลัพธ์เหล่านี้เป็นตัวอย่างจำลองที่แสดงถึงความสามารถของ Super AI Agent ในการสร้างคุณค่าให้กับธุรกิจ'
              : 'These results are simulated examples demonstrating the capabilities of Super AI Agent in creating business value'
            }
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-lg mx-auto">
            <button 
              onClick={() => onNavigate?.('signup')}
              className="w-full sm:w-auto px-8 py-4 bg-transparent text-white font-semibold rounded-full backdrop-blur-md border-2 border-white/40 hover:shadow-2xl hover:shadow-pink-500/50 hover:scale-110 transition-all duration-300 shadow-lg shadow-pink-500/30 hover:bg-pink-500/10"
            >
              {currentLang === 'th' ? 'เริ่มต้นโครงการ' : 'Start Your Project'}
            </button>
            <button 
              onClick={() => onNavigate?.('contact')}
              className="w-full sm:w-auto px-8 py-4 border-2 border-white/40 text-white font-semibold rounded-full bg-gray-800/50 backdrop-blur-md hover:bg-cyan-500/30 hover:text-white hover:border-white/40 hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-cyan-500/40"
            >
              {currentLang === 'th' ? 'ติดต่อเราเลย' : 'Contact Us Now'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
