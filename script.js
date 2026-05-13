// LOADING

setTimeout(() => {
    document.getElementById("loadingScreen")
    .style.display = "none";
}, 2500);


// BOOST EFFECT

function startBoost(){

    let percent = 0;

    let interval = setInterval(() => {

        percent++;

        console.log(percent + "%");

        if(percent >= 100){
            clearInterval(interval);
            alert("BOOST SUCCESS");
        }

    }, 50);

}