const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const sqlite3 = require('sqlite3').verbose();
const express = require('express');
const cors = require('cors');

// ==========================================
// 1. CẤU HÌNH DATABASE SQLITE (LƯU KEY VÀ THIẾT BỊ)
// ==========================================
const db = new sqlite3.Database('./uchihav3.db', (err) => {
    if (err) {
        console.error('Lỗi kết nối Database:', err.message);
    } else {
        console.log('Đã kết nối thành công tới Database SQLite.');
    }
});

// Tạo bảng lưu trữ nếu chưa tồn tại
db.run(`CREATE TABLE IF NOT EXISTS keys (
    device_id TEXT PRIMARY KEY,
    key_code TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)`);


// ==========================================
// 2. CẤU HÌNH API SERVER (KẾT NỐI VỚI INDEX.HTML)
// ==========================================
const app = express();
app.use(cors());
app.use(express.json());

// API tiếp nhận yêu cầu kiểm tra Key từ file index.html
app.post('/api/verify-key', (req, res) => {
    const { device_id, key_code } = req.body;
    
    if (!device_id || !key_code) {
        return res.json({ success: false, message: "Thiếu thông tin Thiết bị hoặc Key!" });
    }

    db.get(`SELECT * FROM keys WHERE device_id = ? AND key_code = ?`, [device_id, key_code], (err, row) => {
        if (err) {
            return res.status(500).json({ success: false, message: "Lỗi hệ thống database!" });
        }
        if (row) {
            return res.json({ success: true, message: "Kích hoạt bản quyền Uchiha V3 thành công!" });
        } else {
            return res.json({ success: false, message: "Key sai hoặc thiết bị không khớp!" });
        }
    });
});

// Mở cổng chạy API Server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`API Server Uchiha V3 đang chạy tại port ${PORT}`);
});


// ==========================================
// 3. CẤU HÌNH BOT DISCORD (TỰ ĐỘNG PHÁT KEY)
// ==========================================
const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMessages, 
        GatewayIntentBits.MessageContent
    ] 
});

// THAY THẾ TOKEN CỦA BẠN VÀO ĐÂY (Lấy từ Discord Developer Portal)
const DISCORD_TOKEN = 'MTUwMjE1NjI2MzEzNDMzMDg4MA.G8Wm5C.DiG0NP8EY8QeZYmQo1P7WXpqTcM5AlYVN9vrhk';

client.on('ready', () => {
    console.log(`Bot Discord ${client.user.tag} đã sẵn sàng hoạt động!`);
});

// Lắng nghe lệnh từ người dùng trong Server Discord
client.on('messageCreate', async (message) => {
    // Bỏ qua nếu tin nhắn đến từ một Bot khác
    if (message.author.bot) return;

    // Cú pháp lệnh: !getkey [Mã_Thiết_Bị]
    if (message.content.startsWith('!getkey')) {
        const args = message.content.split(' ');
        const deviceId = args[1]; // Lấy tham số Mã thiết bị ở vị trí thứ 2

        if (!deviceId) {
            return message.reply('⚠️ Vui lòng nhập kèm Mã Thiết Bị (TB)!\nVí dụ mẫu: `!getkey TB_MOBILE_UCHIHA_2026`');
        }

        // Tự động sinh chuỗi Key ngẫu nhiên (Ví dụ: UCHIHA_X8F2K9P1)
        const generatedKey = 'UCHIHA_' + Math.random().toString(36).substring(2, 10).toUpperCase();

        // Ghi đè hoặc thêm mới cặp Thiết bị - Key vào Database
        db.run(`INSERT OR REPLACE INTO keys (device_id, key_code) VALUES (?, ?)`, [deviceId, generatedKey], (err) => {
            if (err) {
                console.error('Lỗi khi lưu key:', err.message);
                return message.reply('❌ Có lỗi xảy ra khi lưu Key vào hệ thống database!');
            }

            // Tạo khung thông báo (Embed) gửi lên kênh Discord
            const embed = new EmbedBuilder()
                .setColor('#FF123A')
                .setTitle('🔑 UCHIHA V3 - KEY GENERATED 🔑')
                .setDescription('Hệ thống cấp phát Key tự động kết nối trực tuyến với Dashboard.')
                .addFields(
                    { name: '📱 Thiết bị (TB)', value: `\`${deviceId}\``, inline: false },
                    { name: '🔐 Key của bạn', value: `\`${generatedKey}\``, inline: false }
                )
                .setFooter({ text: 'Uchiha Premium System • Copy và dán vào giao diện Web để mở khóa' })
                .setTimestamp();

            message.reply({ embeds: [embed] });
        });
    }
});

// Tiến hành đăng nhập Bot vào Discord
client.login(DISCORD_TOKEN).catch(err => {
    console.error('Không thể đăng nhập Bot Discord. Hãy kiểm tra lại Token:', err.message);
});
