const { createClient } = require('bedrock-protocol');

// هذا الإعداد هو "الوضع الآمن" للبوت
const botOptions = {
  host: 'Bluelightmine.aternos.me', 
  port: 51069,                  
  username: 'RealPlayer_AFK',        
  offline: true,
  // بدلاً من الاعتماد الكلي، سنحدد البروتوكول برقم ثابت يطابق 1.26
  version: '1.26.20',
  skipPing: true, // تخطي اختبار Ping لتجنب تعارض البروتوكولات في البداية
};

function connect() {
  const client = createClient(botOptions);

  client.on('connect', () => console.log('تم الاتصال...'));
  
  client.on('spawn', () => console.log('البوت دخل العالم بنجاح!'));

  // إخفاء أخطاء الـ Protocol غير الضرورية لضمان استمرار البوت
  client.on('error', (err) => {
    // إذا كان الخطأ مجرد "Undefined Packet"، تجاهله واستمر
    if (err.message.includes('undefined')) {
      console.log('تحذير: حزمة غير معروفة، جاري التجاوز...');
    } else {
      console.error('خطأ فادح:', err.message);
    }
  });

  client.on('close', () => setTimeout(connect, 60000));
}

connect();
