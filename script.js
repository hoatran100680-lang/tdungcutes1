// ========================================================
// 1. GIẢI PHÁP SỬA LỖI TRÌNH DUYỆT KHÔNG PHÁT ÂM THANH
// Sử dụng AudioContext tạo sóng hình sin cơ học tức thời (Không lo lỗi file âm thanh)
// ========================================================
let isSoundEnabled = true;

function playSystemSound(type) {
    if (!isSoundEnabled) return;

    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        const ctx = new AudioContext();
        
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.connect(gain);
        gain.connect(ctx.destination);

        if (type === 'click') {
            // Âm thanh tách click gọn gàng
            osc.type = 'sine';
            osc.frequency.setValueAtTime(580, ctx.currentTime);
            gain.gain.setValueAtTime(0.2, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);
            osc.start();
            osc.stop(ctx.currentTime + 0.05);
        } else if (type === 'slide') {
            // Âm thanh tạch nhỏ tần số cao khi rê thanh kéo
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(950, ctx.currentTime);
            gain.gain.setValueAtTime(0.04, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.005, ctx.currentTime + 0.02);
            osc.start();
            osc.stop(ctx.currentTime + 0.02);
        }
    } catch (e) {
        console.log("Trình duyệt yêu cầu tương tác trước khi phát âm thanh.");
    }
}

// ========================================================
// 2. ĐỒNG BỘ CHUYỂN ĐỔI CÁC TAB
// ========================================================
const navItems = document.querySelectorAll('.nav-item');
const tabPanels = document.querySelectorAll('.tab-panel');

navItems.forEach(item => {
    item.addEventListener('click', function() {
        navItems.forEach(nav => nav.classList.remove('active'));
        tabPanels.forEach(panel => panel.classList.remove('active'));

        this.classList.add('active');
        const targetTabId = this.getAttribute('data-tab');
        const targetPanel = document.getElementById(targetTabId);
        
        if (targetPanel) {
            targetPanel.classList.add('active');
        }
        playSystemSound('click');
    });
});

// ========================================================
// 3. ĐỒNG BỘ KÉO SLIDER VÀ TÍNH TOÁN CÔNG SUẤT TỔNG
// ========================================================
const sliders = document.querySelectorAll('.range-slider');
const totalPercentText = document.getElementById('total-percent');
const syncDesc = document.getElementById('sync-desc');
let slideThrottle = false;

sliders.forEach(slider => {
    slider.addEventListener('input', function() {
        const targetLabelId = this.getAttribute('data-target');
        document.getElementById(targetLabelId).textContent = this.value + '%';

        let sum = 0;
        sliders.forEach(s => sum += parseInt(s.value));
        let average = Math.round(sum / sliders.length);

        totalPercentText.textContent = average + '%';
        
        if (average === 100) {
            syncDesc.textContent = "Đồng bộ tối ưu hóa thành công";
        } else if (average === 0) {
            syncDesc.textContent = "Vui lòng điều chỉnh để đồng bộ hóa";
        } else {
            syncDesc.textContent = "Hệ thống đang điều chỉnh hiệu năng";
        }

        // Kiểm soát tần suất âm thanh khi kéo liên tục
        if (!slideThrottle) {
            playSystemSound('slide');
            slideThrottle = true;
            setTimeout(() => slideThrottle = false, 50);
        }
    });
});

// Sự kiện phát âm thanh khi chạm đổi bất kỳ công tắc nào
document.addEventListener('change', function(e) {
    if (e.target && e.target.classList.contains('sound-switch')) {
        playSystemSound('click');
    }
});

// Công tắc quản lý âm thanh tổng
document.getElementById('master-sound').addEventListener('change', function() {
    isSoundEnabled = this.checked;
    playSystemSound('click');
});

// ========================================================
// 4. CHỨC NĂNG THAY ĐỔI MÀU SẮC GIAO DIỆN CHỦ ĐẠO
// ========================================================
const themeSelector = document.getElementById('theme-selector');
const appContainer = document.getElementById('app-container');

themeSelector.addEventListener('change', function() {
    appContainer.setAttribute('data-theme', this.value);
    playSystemSound('click');
});

// ========================================================
// 5. CHỨC NĂNG DỌN DẸP RAM THÀNH CÔNG
// ========================================================
const btnCleanRam = document.getElementById('btn-clean-ram');
const cleanToast = document.getElementById('clean-toast');

btnCleanRam.addEventListener('click', function() {
    playSystemSound('click');
    btnCleanRam.textContent = "⏳ ĐANG QUÉT DỌN...";
    btnCleanRam.disabled = true;

    setTimeout(() => {
        // Đưa thông số hiển thị RAM về mức tối thiểu
        document.getElementById('live-ram').textContent = "112 MB";
        ramPoints = Array(maxPoints).fill(15); // Đẩy đồ thị RAM xuống đáy thấp
        
        btnCleanRam.textContent = "🧹 DỌN DẸP BỘ NHỚ ĐỆM RAM";
        btnCleanRam.disabled = false;
        
        // Hiện thông báo popup thành công
        cleanToast.style.display = 'block';
        setTimeout(() => {
            cleanToast.style.display = 'none';
        }, 2500);
    }, 1200);
});

// ========================================================
// 6. VẼ HAI ĐỒ THỊ SÓNG LIVE REALTIME SÁT THỰC TẾ
// ========================================================
const cpuCanvas = document.getElementById('cpuChart');
const ramCanvas = document.getElementById('ramChart');
const cpuCtx = cpuCanvas.getContext('2d');
const ramCtx = ramCanvas.getContext('2d');

const maxPoints = 4
