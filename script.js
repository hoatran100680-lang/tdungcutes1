document.addEventListener("DOMContentLoaded", function() {
    
    // TÍNH NĂNG 1: CHUYỂN ĐỔI QUA LẠI GIỮA CÁC TAB MENU
    const navItems = document.querySelectorAll(".nav-item");
    const tabContents = document.querySelectorAll(".tab-content");

    navItems.forEach(item => {
        item.addEventListener("click", function() {
            // Xóa class active hiện tại của nút menu
            document.querySelector(".nav-item.active").classList.remove("active");
            // Thêm active vào nút vừa click
            this.classList.add("active");

            // Ẩn tab cũ, hiển thị tab tương ứng mới
            const targetTab = this.getAttribute("data-tab");
            tabContents.forEach(tab => {
                tab.classList.remove("active");
                if(tab.id === targetTab) {
                    tab.classList.add("active");
                }
            });
        });
    });

    // TÍNH NĂNG 2: ĐIỀU CHỈNH THANH TRƯỢT RANGE SLIDER
    const rangeSlider = document.querySelector(".range-slider");
    const rangeValue = document.querySelector(".range-value");

    if (rangeSlider && rangeValue) {
        rangeSlider.addEventListener("input", function() {
            rangeValue.textContent = this.value + "%";
        });
    }

    // TÍNH NĂNG 3: CHỌN CHẾ ĐỘ CHIẾN ĐẤU (RADIO BOXES)
    const radioCards = document.querySelectorAll(".radio-card");
    
    radioCards.forEach(card => {
        card.addEventListener("click", function() {
            const groupName = this.getAttribute("data-radio");
            
            // Tắt các lựa chọn khác cùng nhóm
            document.querySelectorAll(`.radio-card[data-radio="${groupName}"]`).forEach(c => {
                c.classList.remove("active");
                const icon = c.querySelector(".radio-icon");
                icon.className = "fa-regular fa-circle radio-icon";
            });

            // Kích hoạt ô hiện tại
            this.classList.add("active");
            const activeIcon = this.querySelector(".radio-icon");
            activeIcon.className = "fa-solid fa-circle-check radio-icon";
        });
    });

    // TÍNH NĂNG 4: HIỆU ỨNG NHẤN NÚT "BOOST NGAY"
    const btnBoost = document.getElementById("btnBoost");
    if(btnBoost) {
        btnBoost.addEventListener("click", function() {
            this.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> ĐANG TỐI ƯU...';
            this.style.backgroundColor = "#990000";
            
            setTimeout(() => {
                this.innerHTML = '<i class="fa-solid fa-circle-check"></i> ĐÃ HOÀN THÀNH';
                this.style.backgroundColor = "#00ff66";
                this.style.boxShadow = "0 4px 15px rgba(0, 255, 102, 0.4)";
                
                // Trả về trạng thái cũ sau 2 giây
                setTimeout(() => {
                    this.innerHTML = '<i class="fa-solid fa-rocket"></i> BOOST NGAY';
                    this.style.backgroundColor = "var(--accent-red)";
                    this.style.boxShadow = "0 4px 15px var(--glow-red)";
                }, 2000);
            }, 1500);
        });
    }
});
