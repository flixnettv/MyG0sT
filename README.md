# 🤖 MyGhost v2.0

نظام AI Agent متطور يدعم 4 نماذج ذكية مختلفة.

## ✨ المميزات

- 4 نماذج AI (Claude, Groq, ACE3, Custom)
- Telegram Bot للتفاعل الفوري
- قاعدة بيانات Supabase مجانية
- 11+ أداة ذكية
- Docker Support
- Flutter Mobile App

## 🚀 البدء السريع

```bash
# 1. تثبيت المكتبات
npm install

# 2. إعداد المتغيرات
cp .env.example .env
# أضف المفاتيح في .env

# 3. التشغيل
npm start

# 4. مع Docker
docker-compose up -d
```

## 📋 API Endpoints

```txt
GET  /health              فحص الصحة
GET  /api/info            معلومات الخادم
GET  /api/models          قائمة النماذج
POST /api/models/switch   تبديل النموذج
POST /api/chat            إرسال رسالة للمساعد
GET  /api/tools           قائمة الأدوات
POST /api/tools/execute   تنفيذ أداة
```

## 📝 ملفات التوثيق

- [SETUP.md](./SETUP.md)
- [API.md](./API.md)
- [DEPLOYMENT.md](./DEPLOYMENT.md)

## 📝 الترخيص

MIT
