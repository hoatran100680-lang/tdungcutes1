async function checkKey(){

    const key = document.getElementById('keyInput').value;

    const res = await fetch('keys.json');

    const data = await res.json();

    const status = document.getElementById('status');

    const deviceID = navigator.userAgent;

    if(!data[key]){
        status.innerHTML = 'Key không tồn tại';
        status.style.color = 'red';
        return;
    }

    const expire = new Date(data[key].expires);
    const now = new Date();

    if(now > expire){
        status.innerHTML = 'Key đã hết hạn';
        status.style.color = 'orange';
        return;
    }

    if(data[key].device && data[key].device !== deviceID){
        status.innerHTML = 'Key đã được dùng trên thiết bị khác';
        status.style.color = 'red';
        return;
    }

    if(!data[key].device){
        data[key].device = deviceID;
    }

    localStorage.setItem('user_key', key);

    status.innerHTML = 'Kích hoạt thành công';
    status.style.color = 'lime';

    setTimeout(()=>{
        window.location.href = 'menu.html';
    },1000);
}