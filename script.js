document.addEventListener("DOMContentLoaded", () => {
    // =========================================================================
    // 1. CẤU HÌNH BIẾN TOÀN CỤC & BỘ NHỚ TRÌNH DUYỆT (LOCALSTORAGE)
    // =========================================================================
    const API_URL = " https://subplot-override-poking.ngrok-free.dev";
    const CIRCLE_CIRCUMFERENCE = 251.2;
    let selectedGame = "FREE FIRE";

    // Kiểm tra xem người dùng đã từng kích hoạt Key thành công trước đó chưa
    let isKeyActivated = localStorage.getItem("uchiha_activated") === "true";

    // Khai báo danh sách Sliders màn hình BOOST
    const sliders = [
        { input: document.getElementById("slide-01"), valLbl: document.getElementById("val-01"), sumLbl: document.getElementById("lbl-01") },
        { input: document.getElementById("slide-02"), valLbl: document.getElementById("val-02"), sumLbl: document.getElementById("lbl-02") },
        { input: document.getElementById("slide-03"), valLbl: document.getElementById("val-03"), sumLbl: document.getElementById("lbl-03") },
        { input: document.getElementById("slide-04"), valLbl: document.getElementById("val-04"), sumLbl: document.getElementById("lbl-04") }
    ];

    // Hàm cưỡng bức chuyển màn hình khi kích hoạt thành công
    function forceSwitchToScreen(screenId) {
        const screens = document.querySelectorAll(".app-screen");
        const navItems = document.querySelectorAll(".nav-item");

        screens.forEach(s => {
            s.classList.remove("active");
            s.style.display = "none"; // Ẩn hoàn toàn bằng CSS
        });
        
        const targetScreen = document.getElementById(screenId);
        if (targetScreen) {
            targetScreen.classList.add("active");
            targetScreen.style.display = "block"; // Ép hiện màn hình đích
        }

        navItems.forEach(n => n.classList.remove("active"));
        const targetNav = document.querySelector(`[data-target="${screenId}"]`);
        if (targetNav) targetNav.classList.add("active");
    }

    // Nếu đã kích hoạt từ trước, bỏ qua màn hình khóa, chuyển thẳng vào BOOST
    if (isKeyActivated) {
        forceSwitchToScreen("screen-boost");
    } else {
        forceSwitchToScreen("screen-home");
    }

    // =========================================================================
    // 2. XỬ LÝ THANH ĐIỀU HƯỚNG (BOTTOM NAVIGATION)
    // =========================================================================
    const navItems = document.querySelectorAll(".nav-item");
    navItems.forEach(item => {
        item.addEventListener("click", () => {
            const targetId = item.getAttribute("data-target");

            // Nếu cố tình bấm tab khác khi chưa kích hoạt Key -> Chặn và đẩy về HOME
            if (!isKeyActivated && targetId !== "screen-home") {
                alert("🔒 Vui lòng nhập và kích hoạt mã Key hợp lệ tại màn hình HOME trước!");
                forceSwitchToScreen("screen-home");
                return;
            }

            forceSwitchToScreen(targetId);
            if (navigator.vibrate) navigator.vibrate(12);
        });
    });

    // =========================================================================
    // 3. XỬ LÝ XÁC THỰC KEY THỜI GIAN THỰC (REAL-TIME KEY ACTIVATION)
    // =========================================================================
    const btnActivate = document.getElementById("btnActivateKey");
    const keyInput = document.getElementById("keyInput");

    if (btnActivate && keyInput) {
        btnActivate.addEventListener("click", async () => {
            const keyVal = keyInput.value.trim();
            if (!keyVal) {
                alert("Vui lòng điền mã Key kích hoạt!");
                return;
            }

            btnActivate.disabled = true;
            btnActivate.textContent = "VERIFYING...";

            try {
                // Gọi API kết nối Server Bot Discord
                const response = await fetch(`${API_URL}?key=${encodeURIComponent(keyVal)}`);
                const result = await response.json();

                if (result.valid) {
                    // Cập nhật trạng thái hệ thống và lưu vĩnh viễn vào bộ nhớ web
                    isKeyActivated = true;
                    localStorage.setItem("uchiha_activated", "true");

                    const expiryDisplay = result.expiry === 'forever' ? 'Vĩnh Viễn' : new Date(result.expiry).toLocaleString('vi-VN');
                    alert(`🎉 KÍCH HOẠT THÀNH CÔNG!\n⏱️ Hạn dùng: ${expiryDisplay}\nHệ thống đã mở khóa toàn bộ tính năng.`);
                    
                    // ÉP BUỘC CHUYỂN MÀN HÌNH KHÔNG CHO TRỄ
                    forceSwitchToScreen("screen-boost");
                } else {
                    alert(`❌ LỖI KHỞI CHẠY: ${result.message}`);
                }
            } catch (error) {
                console.error("Lỗi kết nối API:", error);
                alert("❌ KHÔNG KẾT NỐI ĐƯỢC ĐẾN SERVER BOT!\nHãy đảm bảo bạn đã mở terminal chạy lệnh 'node index.js'.");
            } finally {
                btnActivate.disabled = false;
                btnActivate.textContent = "ACTIVATE KEY";
            }
        });
    }

    // =========================================================================
    // 4. QUẢN LÝ THANH KÉO SLIDERS & ĐỒ THỊ TRÒN (MÀN HÌNH BOOST)
    // =========================================================================
    const circleProgress = document.getElementById("globalProgressCircle");
    const globalPercentText = document.getElementById("globalPercentText");

    function updateDashboardValues() {
        let total = 0;
        let validSlidersCount = 0;

        sliders.forEach(item => {
            if (!item.input) return;
            
            const val = item.input.value;
            if (item.valLbl) item.valLbl.textContent = `${val}%`;
            if (item.sumLbl) item.sumLbl.textContent = `${val}%`;
            
            total += parseInt(val);
            validSlidersCount++;
            
            const percent = (val - item.input.min) / (item.input.max - item.input.min) * 100;
            item.input.style.background = `linear-gradient(to right, #da3746 0%, #da3746 ${percent}%, #3a1f25 ${percent}%, #3a1f25 100%)`;
        });

        if (validSlidersCount === 0) return;

        const average = Math.round(total / validSlidersCount);
        if (globalPercentText) globalPercentText.textContent = `${average}%`;
        
        if (circleProgress) {
            const offset = CIRCLE_CIRCUMFERENCE - (average / 100) * CIRCLE_CIRCUMFERENCE;
            circleProgress.style.strokeDashoffset = offset;
        }
    }

    sliders.forEach(item => {
        if (item.input) {
            item.input.addEventListener("input", updateDashboardValues);
        }
    });

    // Chọn lựa phiên bản Free Fire / Free Fire Max
    const gameCards = document.querySelectorAll(".game-card");
    const gameTitleText = document.getElementById("current-game-title");

    gameCards.forEach(card => {
        card.addEventListener("click", () => {
            gameCards.forEach(c => c.classList.remove("active"));
            card.classList.add("active");
            selectedGame = card.querySelector("span").textContent;
            if (gameTitleText) gameTitleText.textContent = selectedGame;
            if (navigator.vibrate) navigator.vibrate(10);
        });
    });

    // Khởi chạy game giả lập
    const btnLaunch = document.getElementById("btnLaunchGame");
    const loaderOverlay = document.getElementById("game-loader-overlay");
    const loaderText = document.getElementById("loader-text");

    if (btnLaunch && loaderOverlay) {
        btnLaunch.addEventListener("click", () => {
            loaderOverlay.classList.add("show");
            if (loaderText) loaderText.textContent = `Connecting & Injecting optimization to ${selectedGame}...`;

            setTimeout(() => {
                if (loaderText) loaderText.innerHTML = `<i class="fa-solid fa-circle-check" style="color:#2ecc71;"></i> Injection Successful! Launching Game...`;
                
                setTimeout(() => {
                    loaderOverlay.classList.remove("show");
                    if (selectedGame === "FREE FIRE") {
                        window.location.href = "android-app://com.dts.freefireth";
                    } else {
                        window.location.href = "android-app://com.dts.freefiremax";
                    }
                }, 1200);
            }, 2500);
        });
    }

    // =========================================================================
    // 5. GIẢ LẬP DỌN DẸP BỘ NHỚ RAM (MÀN HÌNH LIVE)
    // =========================================================================
    const btnCleanRAM = document.getElementById("btnCleanRAM");
    const ramPercentText = document.getElementById("ramPercentText");
    const ramStatusText = document.getElementById("ramStatusText");

    if (btnCleanRAM) {
        btnCleanRAM.addEventListener("click", () => {
            btnCleanRAM.disabled = true;
            btnCleanRAM.textContent = "CLEANING RAM...";
            if (ramStatusText) ramStatusText.textContent = "Scanning system logs & background caches...";

            setTimeout(() => {
                const optimizedRAM = Math.floor(Math.random() * (45 - 38 + 1)) + 38;
                const releasedMemory = Math.floor(Math.random() * (1200 - 800 + 1)) + 800;

                if (ramPercentText) ramPercentText.textContent = `${optimizedRAM}%`;
                if (ramStatusText) ramStatusText.textContent = `🟢 Cleaned! Released ${releasedMemory}MB of RAM successfully.`;
                
                btnCleanRAM.disabled = false;
                btnCleanRAM.textContent = "OPTIMIZE NOW";
                
                if (navigator.vibrate) navigator.vibrate();
            }, 3000);
        });
    }

    // Khởi tạo đồ thị
    updateDashboardValues();
});
