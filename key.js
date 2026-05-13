// =====================================
// UCHIHA V3 KEY SYSTEM
// =====================================

// DANH SÁCH KEY

const keys = {

    "VIP-1DAY": {
        duration: 1
    },

    "VIP-7DAY": {
        duration: 7
    },

    "VIP-30DAY": {
        duration: 30
    },

    "VIP-LIFETIME": {
        duration: 99999
    }

};

// =====================================
// KIỂM TRA KEY
// =====================================

function checkKey(){

    // INPUT

    const input =

    document
    .getElementById(
    "keyInput"
    )
    .value
    .trim();

    // STATUS

    const status =

    document
    .getElementById(
    "status"
    );

    // EMPTY

    if(input === ""){

        status.innerHTML =
        "VUI LÒNG NHẬP KEY ❌";

        status.style.color =
        "#ff5577";

        return;

    }

    // VALID KEY

    if(keys[input]){

        // TIME

        const now =
        Date.now();

        const expire =

        now +

        (
            keys[input]
            .duration *

            24 *
            60 *
            60 *
            1000
        );

        // SAVE DATA

        localStorage.setItem(
        "userKey",
        input
        );

        localStorage.setItem(
        "expire",
        expire
        );

        localStorage.setItem(
        "login",
        "true"
        );

        // SUCCESS

        status.innerHTML =
        "KÍCH HOẠT THÀNH CÔNG ✅";

        status.style.color =
        "#55ff99";

        // REDIRECT

        setTimeout(()=>{

            window.location.href =
            "index.html";

        },1500);

    }

    // INVALID KEY

    else{

        status.innerHTML =
        "KEY KHÔNG HỢP LỆ ❌";

        status.style.color =
        "#ff5577";

    }

}

// =====================================
// CHECK HẾT HẠN
// =====================================

function checkExpire(){

    const expire =

    localStorage.getItem(
    "expire"
    );

    if(!expire) return;

    // EXPIRE

    if(

        Date.now()

        >

        Number(expire)

    ){

        alert(
        "KEY ĐÃ HẾT HẠN ❌"
        );

        localStorage.clear();

        window.location.href =
        "key.html";

    }

}

// =====================================
// AUTO LOGIN
// =====================================

function autoLogin(){

    const login =

    localStorage.getItem(
    "login"
    );

    const expire =

    localStorage.getItem(
    "expire"
    );

    // NOT LOGIN

    if(!login){

        window.location.href =
        "key.html";

        return;

    }

    // EXPIRE

    if(

        Date.now()

        >

        Number(expire)

    ){

        localStorage.clear();

        window.location.href =
        "key.html";

    }

}

// =====================================
// LOGOUT
// =====================================

function logoutKey(){

    localStorage.clear();

    alert(
    "ĐÃ ĐĂNG XUẤT"
    );

    window.location.href =
    "key.html";

}

// =====================================
// HIỂN THỊ THÔNG TIN KEY
// =====================================

function getKeyInfo(){

    const key =

    localStorage.getItem(
    "userKey"
    );

    const expire =

    localStorage.getItem(
    "expire"
    );

    if(!key) return;

    // DAYS LEFT

    const daysLeft =

    Math.floor(

        (
            Number(expire)

            -

            Date.now()

        )

        /

        (

            1000 *
            60 *
            60 *
            24

        )

    );

    console.log(
    "KEY:",
    key
    );

    console.log(
    "CÒN:",
    daysLeft,
    "NGÀY"
    );

}

// =====================================
// AUTO START
// =====================================

checkExpire();
getKeyInfo();