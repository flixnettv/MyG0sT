import axios from 'axios';

const nenoClient = axios.create({
  baseURL: process.env.NENO_API_URL,
  headers: {
    Authorization: `Bearer ${process.env.NENO_API_KEY}`,
    'Content-Type': 'application/json'
  }
});

export async function saveUserData(userId, key, data) {
  try {
    const response = await nenoClient.post(`/data/${userId}/${key}`, {
      value: data,
      timestamp: new Date().toISOString()
    });
    return response.data;
  } catch (error) {
    console.error('Neno saveUserData error:', error.message);
    return null;
  }
}

export async function getUserData(userId, key) {
  try {
    const response = await nenoClient.get(`/data/${userId}/${key}`);
    return response.data.value;
  } catch (error) {
    console.error('Neno getUserData error:', error.message);
    return null;
  }
}

export async function backupConversation(userId, data) {
  try {
    const response = await nenoClient.post(`/backup/${userId}`, {
      data,
      timestamp: new Date().toISOString()
    });
    return response.data;
  } catch (error) {
    console.error('Neno backupConversation error:', error.message);
    return null;
  }
}

export async function healthCheck() {
  try {
    await nenoClient.get('/health');
    return true;
  } catch {
    return false;
  }
}
