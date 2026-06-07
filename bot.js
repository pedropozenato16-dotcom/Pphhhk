const bedrock = require('bedrock-protocol');

// إعدادات الاتصال بالسيرفر مأخوذة من صورتك
const botOptions = {
  host: 'Bluelightmine.aternos.me', // الـ IP الخاص بسيرفرك
  port: 51069,                      // المنفذ (Port) الخاص بسيرفرك
  username: 'RealPlayer_AFK',       // اسم البوت داخل اللعبة
  offline: true,                    // مفعل للسيرفرات المكركة (Cracked)
  version: '1.21.130'               // تحديد الإصدار المطابق لسيرفرك
};

// إنشاء الاتصال بالسيرفر
const client = bedrock.createClient(botOptions);

console.log(`جاري محاولة الاتصال بسيرفر البدروك إصدار ${botOptions.version}...`);

let currentPos = { x: 0, y: 0, z: 0 };
let hasSpawned = false;

// 1. الحصول على إحداثيات الرسبون الصحيحة عند بداية تحميل اللعبة
client.on('start_game', (packet) => {
  if (packet.player_position) {
    currentPos = { 
      x: packet.player_position.x, 
      y: packet.player_position.y, 
      z: packet.player_position.z 
    };
    console.log(`[إحداثيات] تم تحديد موقع الرسبون الأولي: X: ${currentPos.x.toFixed(2)}, Y: ${currentPos.y.toFixed(2)}, Z: ${currentPos.z.toFixed(2)}`);
  }
});

// 2. عند نجاح رسبون البوت بالكامل داخل العالم
client.on('spawn', () => {
  if (hasSpawned) return; // لتجنب تكرار تشغيل الحلقة إذا مات البوت ورسبن مجدداً
  hasSpawned = true;
  
  console.log(`[+] دخل ${botOptions.username} إلى السيرفر بنجاح وهو الآن متصل!`);
  
  // بدء حلقة الحركة والتفاعل العشوائي كل 10 ثوانٍ
  startBedrockLoop();
});

function startBedrockLoop() {
  setInterval(() => {
    if (!client) return;

    // توليد زوايا نظر وحركة عشوائية بسيطة لتجنب الطرد
    const randomYaw = Math.random() * 360;
    const randomPitch = (Math.random() * 180) - 90;

    const moveX = (Math.random() * 0.4) - 0.2;
    const moveZ = (Math.random() * 0.4) - 0.2;
    
    currentPos.x += moveX;
    currentPos.z += moveZ;

    try {
      // إرسال حزمة الحركة والنظر الرسمية (Player Auth Input Packet) للبدروك
      client.write('player_auth_input', {
        pitch: randomPitch,
        yaw: randomYaw,
        position: { x: currentPos.x, y: currentPos.y, z: currentPos.z },
        move_vector: { x: moveX, z: moveZ },
        head_yaw: randomYaw,
        input_flags: {
          move_forward: moveX > 0,
          move_backward: moveX < 0,
          move_left: moveZ > 0,
          move_right: moveZ < 0,
          sneaking: false,
          jumping: Math.random() > 0.8 // يقفز أحياناً لتوثيق النشاط
        },
        input_mode: 'mouse',
        play_mode: 'normal',
        interaction_model: 'touch',
        tick: 0n,
        delta: { x: 0, y: 0, z: 0 }
      });

      console.log(`[حركة] البوت تحرك إلى X: ${currentPos.x.toFixed(2)}, Z: ${currentPos.z.toFixed(2)}`);
    } catch (packetError) {
      // تجنب انهيار السكربت في حال لم تدعم الحزمة بعض الخصائص الفرعية
    }

    // شات عشوائي بنسبة ضئيلة جداً لتفادي نظام كشف السبام
    if (Math.random() < 0.1) {
      const phrases = ["Hello everyone", "AFK Bot online", "Testing connection...", "No lag!"];
      const randomTxt = phrases[Math.floor(Math.random() * phrases.length)];
      
      try {
        client.write('text', {
          type: 'chat',
          needs_translation: false,
          source_name: botOptions.username,
          xuid: '',
          platform_chat_id: '',
          message: randomTxt
        });
        console.log(`[شات] البوت أرسل: "${randomTxt}"`);
      } catch (textError) {
        // تجاهل أخطاء الشات المؤقتة
      }
    }

  }, 10000); // يتحرك خطوة كل 10 ثوانٍ ليكون أكثر استقراراً على غيت هاب
}

// التعامل مع الأخطاء والطرد من السيرفر
client.on('kick', (packet) => {
  console.log(`[-] تم طرد البوت من السيرفر. السبب: ${packet.reason}`);
});

client.on('error', (err) => {
  console.error(`[خطأ] حدث خطأ في الاتصال:`, err);
});
