export async function checkEmails() {
  return { success: true, emails: [], provider: 'gmail' };
}

export async function sendEmail(payload) {
  return { success: true, message: 'Email sent', payload };
}
