const { createClient } = require('bedrock-protocol');

function startBot() {
    console.log('🔄 محاولة الاتصال بـ Bluelightmine...');

    const client = createClient({
        host: 'Bluelightmine.aternos.me',
        port: 51069,
        username: 'RealPlayer_AFK',
        offline: true,
        version: '1.26.20',
        device: {
            deviceOS: 1, // Android
            deviceModel: 'Pixel 7',
        }
    });

    // دالة الحركة العشوائية
    function startRandomMovement() {
        setInterval(() => {
            // إرسال حزمة حركة لتنبيه السيرفر أن اللاعب نشط
            client.write('player_auth_input', {
                pitch: Math.random() * 90 - 45,
                yaw: Math.random() * 360 - 180,
                position: { x: 0, y: 100, z: 0 }, // موقع البوت (يمكن تعديله)
                moveVector: { x: (Math.random() - 0.5) * 0.1, z: (Math.random() - 0.5) * 0.1 },
                inputMode: 0,
                playMode: 0,
                interactionMode: 0,
                transaction: { type: 0 }
            });
        }, 15000); // يتحرك كل 15 ثانية
    }

    client.on('connect', () => {
        console.log('✅ تم الاتصال!');
    });

    client.on('spawn', () => {
        console.log('🎮 البوت داخل العالم الآن!');
        startRandomMovement(); // تشغيل الحركة بمجرد الدخول
    });

    client.on('error', (err) => {
        console.log('⚠️ خطأ (يمكن تجاهله):', err.message);
    });

    client.on('kick', (packet) => {
        console.log('❌ تم الطرد. السبب:', packet.message || 'Silent Disconnect');
        setTimeout(startBot, 60000); // إعادة المحاولة
    });
}

startBot();
