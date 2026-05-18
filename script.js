// Khởi tạo hệ thống Synth Audio Kỹ Thuật Số
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

// Hàm tạo âm thanh thông minh đa tần số
function playSoundEffect(frequency = 500, duration = 0.08, type = 'sine', volume = 0.15) {
    const soundToggle = document.getElementById('sound-effect-toggle');
    if (soundToggle && !soundToggle.checked) return;

    const o = audioCtx.createOscillator();
    const g = audioCtx.createGain();

    o.type = type;
    o.frequency.setValueAtTime(frequency, audioCtx.currentTime);
    
    g.gain.setValueAtTime(volume, audioCtx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

    o.connect(g);
    g.connect(audioCtx.destination);

    o.start();
    o.stop(audioCtx.currentTime + duration);
}

// 1. CHUYỂN TAB CHỨC NĂNG VỚI ÂM THANH KHÁC BIỆT
const navItems = document.querySelectorAll('.nav-item');
navItems.forEach((item, index) => {
    item.addEventListener('click', () => {
        if(item.classList.contains('active')) return;

        // Tần số tăng dần theo từng ô tab từ trái qua phải (Tạo cảm giác lướt âm)
        playSoundEffect(500 + (index * 80), 0.06, 'triangle', 0.12);

        document.querySelector('.nav-item.active').classList.remove('active');
        document.querySelector('.tab-panel.active').classList.remove('active');

        item.classList.add('active');
        const target = item.getAttribute('data-tab');
        document.getElementById(target).classList.add('active');
    });
});

// 2. CHUYỂN ĐỔI CÔNG TẮC (ON/OFF) - ÂM THANH KÉP NỐT CAO/TRẦM
document.querySelectorAll('.switch input').forEach(toggle => {
    toggle.addEventListener('change', () => {
        if (toggle.checked) {
            // Âm thanh kích hoạt (Beep kép vui tai)
            playSoundEffect(650, 0.04, 'sine');
            setTimeout(() => playSoundEffect(950, 0.06, 'sine'), 40);
        } else {
            // Âm thanh hủy bỏ (Tắt âm đục)
            playSoundEffect(350, 0.08, 'triangle');
        }
    });
});

// 3. ÂM THANH KHI KÉO CÀI ĐẶT SLIDER (THAY ĐỔI THEO GIÁ TRỊ)
const dpiSlider = document.getElementById('dpi-slider');
if(dpiSlider) {
    dpiSlider.addEventListener('input', (e) => {
        document.getElementById('dpi-num').innerText = e.target.value;
        playSoundEffect(parseInt(e.target.value) / 2, 0.02, 'sine', 0.05);
    });
}

const sensSlider = document.getElementById('sens-slider');
if(sensSlider) {
    sensSlider.addEventListener('input', (e) => {
        document.getElementById('sens-num').innerText = e.target.value + "%";
        playSoundEffect(parseInt(e.target.value) * 3, 0.02, 'sine', 0.05);
    });
}

// 4. ĐỔI GIAO DIỆN MÀU ĐEN / SÁNG
document.getElementById('theme-toggle-btn').addEventListener('click', () => {
    playSoundEffect(250, 0.2, 'sawtooth', 0.08); 
    const isDark = document.body.classList.contains('dark-theme');
    
    document.body.className = isDark ? 'light-theme' : 'dark-theme';
    document.getElementById('sub-title').innerText = isDark ? "LIGHT FREE FIRE PANEL" : "ULTIMATE FREE FIRE PANEL";
});

// 5. CHỨC NĂNG XỬ LÝ BOOST SIÊU CẤP
document.getElementById('boost-btn').addEventListener('click', (e) => {
    playSoundEffect(800, 0.4, 'sawtooth', 0.1);
    const btn = e.target;
    btn.innerText = "ĐANG TỐI ƯU HOÀN HẢO...";
    btn.disabled = true;

    setTimeout(() => {
        playSoundEffect(1200, 0.2, 'sine', 0.2);
        btn.innerText = "XÓA LAG 100% THÀNH CÔNG";
        document.getElementById('fps-val').innerText = "120"; 
        document.getElementById('ping-val').innerText = "4ms";  
        document.getElementById('performance-val').innerText = "100%";
        
        setTimeout(() => {
            btn.innerText = "BOOST NGAY (XÓA LAG 100%)";
            btn.disabled = false;
        }, 2000);
    }, 1500);
});

// 6. CÁC NÚT TÍNH NĂNG NÂNG CAO DƯỚI TAB BOOST
function handleActionRow(elementId, processText, successText, soundFreq) {
    const el = document.getElementById(elementId);
    if(!el) return;
    el.addEventListener('click', () => {
        playSoundEffect(soundFreq, 0.1, 'triangle');
        const originalText = el.querySelector('.desc').innerText;
        el.querySelector('.desc').innerText = processText;
        el.style.pointerEvents = 'none';

        setTimeout(() => {
            playSoundEffect(soundFreq + 300, 0.15, 'sine');
            el.querySelector('.desc').innerText = successText;
            
            setTimeout(() => {
                el.querySelector('.desc').innerText = originalText;
                el.style.pointerEvents = 'auto';
            }, 2000);
        }, 1200);
    });
}

handleActionRow('clean-ram-btn', 'Đang quét dọn RAM rác...', 'Đã giải phóng +2.4GB RAM!', 500);
handleActionRow('cool-cpu-btn', 'Đang kích hoạt tản nhiệt chất lỏng...', 'Nhiệt độ CPU giảm 5°C!', 400);
handleActionRow('dns-btn', 'Đang tối ưu DNS Google Gaming...', 'Ping ổn định ở mức 4ms!', 600);
