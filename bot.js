const { createClient } = require('bedrock-protocol');

// إعدادات البوت
const botOptions = {
    host: 'Bluelightmine.aternos.me',
    port: 51069,
    username: 'AFK_Bot_Pro',
    offline: true,
    version: '1.26.20', 
    device: {
        deviceOS: 1, // Android
        deviceModel: 'Pixel 7'
    }
};

function startBot() {
    console.log('🚀 بدء تشغيل البوت...');
    const client = createClient(botOptions);

    client.on('connect', () => console.log('✅ تم الاتصال بنجاح!'));

    client.on('spawn', () => {
        console.log('🎮 البوت دخل العالم! يقوم الآن بالتفاعل...');
        
        // تفعيل الحركة العشوائية لمنع الطرد بسبب الخمول
        setInterval(() => {
            client.write('player_auth_input', {
                pitch: Math.random() * 90 - 45,
                yaw: Math.random() * 360 - 180,
                position: { x: 0, y: 0, z: 0 },
                moveVector: { x: 0, z: 0 },
                inputMode: 0, playMode: 0, interactionMode: 0,
                transaction: { type: 0 }
            });
        }, 30000);
    });

    client.on('kick', (packet) => {
        console.error('❌ تم الطرد:', packet.reason || 'Silent Disconnect');
        setTimeout(startBot, 60000);
    });

    client.on('error', (err) => console.log('⚠️ خطأ بروتوكول:', err.message));
}

startBot();
