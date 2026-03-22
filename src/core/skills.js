export const SKILLS = [
  { name: 'check_emails', description: 'فحص البريد الإلكتروني' },
  { name: 'send_email', description: 'إرسال بريد إلكتروني' },
  { name: 'check_calendar', description: 'عرض التقويم' },
  { name: 'add_calendar_event', description: 'إضافة حدث في التقويم' },
  { name: 'transcribe_audio', description: 'تحويل صوت لنص' },
  { name: 'synthesize_speech', description: 'تحويل نص لصوت' },
  { name: 'fetch_url', description: 'جلب محتوى الويب' },
  { name: 'read_file', description: 'قراءة ملف' },
  { name: 'write_file', description: 'كتابة ملف' },
  { name: 'get_system_info', description: 'معلومات النظام' },
  { name: 'search_web', description: 'بحث على الإنترنت' }
];

export async function executeSkill(skillName, input) {
  console.log(`Executing skill: ${skillName}`, input);

  switch (skillName) {
    case 'check_emails':
      return { success: true, emails: [] };
    case 'send_email':
      return { success: true, message: 'Email sent' };
    case 'check_calendar':
      return { success: true, events: [] };
    case 'get_system_info':
      return {
        success: true,
        info: {
          platform: process.platform,
          nodeVersion: process.version,
          uptime: process.uptime()
        }
      };
    default:
      return { success: false, error: 'Unknown skill' };
  }
}

export function getAvailableSkills() {
  return SKILLS;
}
