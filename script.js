"use strict";

/* =========================================================
   DOM
========================================================= */

const canvas =
    document.getElementById("canvas");

const ctx =
    canvas.getContext("2d");

const loginLayer =
    document.getElementById("loginLayer");

const passwordInput =
    document.getElementById("passwordInput");

const loginBtn =
    document.getElementById("loginBtn");

const loginMessage =
    document.getElementById("loginMessage");

const togglePassword =
    document.getElementById("togglePassword");

const intro =
    document.getElementById("intro");

const introContent =
    document.querySelector(".intro-content");

const openBtn =
    document.getElementById("openBtn");

const buttonText =
    document.getElementById("buttonText");

const gameStatus =
    document.getElementById("gameStatus");

const letterLayer =
    document.getElementById("letterLayer");

const closeLetter =
    document.getElementById("closeLetter");

const letterContent =
    document.getElementById("letterContent");


/* =========================================================
   SETTINGS
========================================================= */

const PASSWORD =
    "5.8.2007";

const MAX_DODGES =
    10;

let unlocked =
    false;

let dodgeCount =
    0;

let dodgeLocked =
    false;

let letterOpened =
    false;


/* =========================================================
   CANVAS
========================================================= */

let width =
    window.innerWidth;

let height =
    window.innerHeight;

let dpr =
    Math.min(
        window.devicePixelRatio || 1,
        2
    );


function resizeCanvas() {

    width =
        window.innerWidth;

    height =
        window.innerHeight;

    dpr =
        Math.min(
            window.devicePixelRatio || 1,
            2
        );

    canvas.width =
        width * dpr;

    canvas.height =
        height * dpr;

    canvas.style.width =
        width + "px";

    canvas.style.height =
        height + "px";

    ctx.setTransform(
        dpr,
        0,
        0,
        dpr,
        0,
        0
    );
}


resizeCanvas();


window.addEventListener(
    "resize",
    resizeCanvas
);


/* =========================================================
   PARTICLES
========================================================= */

const particles = [];

const PARTICLE_COUNT =
    window.innerWidth < 600
        ? 850
        : 1450;


function random(min, max) {

    return (
        Math.random() *
        (max - min) +
        min
    );
}


class Particle {

    constructor() {

        this.reset(
            true
        );
    }


    reset(initial = false) {

        this.x =
            random(
                0,
                width
            );

        this.y =
            random(
                0,
                height
            );

        this.z =
            random(
                .15,
                1
            );

        this.size =
            random(
                .4,
                1.8
            );

        this.alpha =
            random(
                .2,
                .85
            );

        this.speed =
            random(
                .05,
                .25
            );

        this.twinkle =
            random(
                0,
                Math.PI * 2
            );

        if (!initial) {

            this.y =
                height + 20;
        }
    }


    update(time) {

        this.y -=
            this.speed;

        this.twinkle +=
            .015;

        if (
            this.y <
            -20
        ) {

            this.reset();
        }
    }


    draw(time) {

        const pulse =
            .75 +
            Math.sin(
                this.twinkle +
                time * .0007
            ) * .25;

        ctx.beginPath();

        ctx.arc(
            this.x,
            this.y,
            this.size * pulse,
            0,
            Math.PI * 2
        );

        ctx.fillStyle =
            `rgba(255,${100 + Math.random() * 70},190,${this.alpha})`;

        ctx.fill();
    }
}


for (
    let i = 0;
    i < PARTICLE_COUNT;
    i++
) {

    particles.push(
        new Particle()
    );
}


/* =========================================================
   HEART PARTICLES
========================================================= */

const heartParticles = [];

const HEART_COUNT =
    window.innerWidth < 600
        ? 1300
        : 2300;


function heartEquation(t) {

    return {
        x:
            16 *
            Math.pow(
                Math.sin(t),
                3
            ),

        y:
            -(
                13 *
                Math.cos(t) -
                5 *
                Math.cos(2 * t) -
                2 *
                Math.cos(3 * t) -
                Math.cos(4 * t)
            )
    };
}


for (
    let i = 0;
    i < HEART_COUNT;
    i++
) {

    const t =
        random(
            0,
            Math.PI * 2
        );

    const heart =
        heartEquation(t);

    const depth =
        random(
            -1,
            1
        );

    const fill =
        Math.sqrt(
            Math.random()
        );

    heartParticles.push({

        t,

        x:
            heart.x *
            fill,

        y:
            heart.y *
            fill,

        z:
            depth,

        size:
            random(
                .35,
                1.5
            ),

        alpha:
            random(
                .25,
                .95
            ),

        phase:
            random(
                0,
                Math.PI * 2
            )
    });
}


/* =========================================================
   DRAW STAR FIELD
========================================================= */

function drawStars(
    time
) {

    for (
        const particle
        of particles
    ) {

        particle.update(
            time
        );

        particle.draw(
            time
        );
    }
}


/* =========================================================
   DRAW HEART
========================================================= */

function drawHeart(
    time
) {

    const centerX =
        width / 2;

    const centerY =
        height / 2;

    const baseScale =
        Math.min(
            width,
            height
        ) / 32;

    const pulse =
        1 +
        Math.sin(
            time * .002
        ) * .025;

    const rotation =
        time * .00012;

    for (
        const particle
        of heartParticles
    ) {

        const depth =
            particle.z;

        let x =
            particle.x *
            baseScale *
            pulse;

        let y =
            particle.y *
            baseScale *
            pulse;

        const depthScale =
            .72 +
            (depth + 1) *
            .16;

        x *=
            depthScale;

        y *=
            depthScale;


        /* 3D rotation */

        const cos =
            Math.cos(
                rotation
            );

        const sin =
            Math.sin(
                rotation
            );

        const rotatedX =
            x * cos -
            depth *
            baseScale *
            4 *
            sin;

        const rotatedZ =
            x * sin +
            depth *
            baseScale *
            4 *
            cos;


        const perspective =
            1 /
            (
                1 +
                rotatedZ /
                (
                    baseScale *
                    28
                )
            );


        const screenX =
            centerX +
            rotatedX *
            perspective;

        const screenY =
            centerY +
            y *
            perspective;


        const glow =
            1 +
            Math.sin(
                particle.phase +
                time * .003
            ) *
            .3;


        const alpha =
            particle.alpha *
            perspective *
            .9;


        ctx.beginPath();

        ctx.arc(
            screenX,
            screenY,
            Math.max(
                .25,
                particle.size *
                perspective *
                glow
            ),
            0,
            Math.PI * 2
        );


        ctx.fillStyle =
            `rgba(255,${45 + 100 * perspective},${120 + 90 * perspective},${alpha})`;

        ctx.fill();
    }
}


/* =========================================================
   CENTRAL GLOW
========================================================= */

function drawGlow() {

    const gradient =
        ctx.createRadialGradient(
            width / 2,
            height / 2,
            0,
            width / 2,
            height / 2,
            Math.min(
                width,
                height
            ) * .48
        );


    gradient.addColorStop(
        0,
        "rgba(255,35,130,.10)"
    );

    gradient.addColorStop(
        .35,
        "rgba(120,30,150,.04)"
    );

    gradient.addColorStop(
        1,
        "rgba(0,0,0,0)"
    );


    ctx.fillStyle =
        gradient;

    ctx.fillRect(
        0,
        0,
        width,
        height
    );
}


/* =========================================================
   ANIMATION
========================================================= */

function animate(
    time
) {

    ctx.clearRect(
        0,
        0,
        width,
        height
    );


    drawStars(
        time
    );


    drawGlow();


    drawHeart(
        time
    );


    requestAnimationFrame(
        animate
    );
}


requestAnimationFrame(
    animate
);


/* =========================================================
   LOGIN MESSAGE
========================================================= */

function showLoginMessage(
    message,
    success = false
) {

    loginMessage.textContent =
        message;

    loginMessage.classList.toggle(
        "success",
        success
    );

    loginMessage.classList.add(
        "visible"
    );
}


/* =========================================================
   LOGIN
========================================================= */

function unlockUniverse() {

    unlocked =
        true;

    loginLayer.classList.add(
        "unlocked"
    );

    loginLayer.setAttribute(
        "aria-hidden",
        "true"
    );


    setTimeout(
        () => {

            loginLayer.style.display =
                "none";

        },
        800
    );
}


function checkPassword() {

    const value =
        passwordInput.value.trim();


    if (
        value === PASSWORD
    ) {

        showLoginMessage(
            "Mở khóa thành công ❤️",
            true
        );


        unlockUniverse();

        return;
    }


    passwordInput.classList.remove(
        "shake"
    );


    void passwordInput.offsetWidth;


    passwordInput.classList.add(
        "shake"
    );


    showLoginMessage(
        "Sai mật mã rồi... thử lại nhé 💗"
    );


    passwordInput.select();
}


loginBtn.addEventListener(
    "click",
    checkPassword
);


passwordInput.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Enter"
        ) {

            event.preventDefault();

            checkPassword();
        }
    }
);


/* =========================================================
   SHOW PASSWORD
========================================================= */

togglePassword.addEventListener(
    "click",
    () => {

        const isHidden =
            passwordInput.type ===
            "password";


        passwordInput.type =
            isHidden
                ? "text"
                : "password";


        togglePassword.textContent =
            isHidden
                ? "◉"
                : "◌";
    }
);


/* =========================================================
   GAME — RANDOM POSITION
========================================================= */

function randomButtonPosition() {

    const rect =
        openBtn.getBoundingClientRect();


    const padding =
        18;


    const maxX =
        Math.max(
            padding,
            window.innerWidth -
            rect.width -
            padding
        );


    const maxY =
        Math.max(
            padding,
            window.innerHeight -
            rect.height -
            padding
        );


    return {

        x:
            random(
                padding,
                maxX
            ),

        y:
            random(
                padding,
                maxY
            )
    };
}


/* =========================================================
   GAME — NÉ NÚT
========================================================= */

function dodgeButton() {

    if (
        dodgeLocked ||
        dodgeCount >= MAX_DODGES
    ) {

        return;
    }


    dodgeCount++;


    const position =
        randomButtonPosition();


    openBtn.style.position =
        "fixed";


    openBtn.style.left =
        `${position.x}px`;


    openBtn.style.top =
        `${position.y}px`;


    openBtn.style.margin =
        "0";


    openBtn.style.transform =
        "none";


    openBtn.classList.remove(
        "dodging"
    );


    void openBtn.offsetWidth;


    openBtn.classList.add(
        "dodging"
    );


    if (
        dodgeCount <
        MAX_DODGES
    ) {

        buttonText.textContent =
            `BẮT ĐƯỢC ANH ĐI 😜 ${dodgeCount}/10`;

        gameStatus.textContent =
            `Nó vừa chạy mất! ${dodgeCount}/10`;

        gameStatus.classList.add(
            "active"
        );

    } else {

        finishDodgeGame();
    }
}


/* =========================================================
   SAU 10 LẦN — ĐỨNG YÊN
========================================================= */

function finishDodgeGame() {

    dodgeLocked =
        true;


    openBtn.classList.add(
        "ready"
    );


    openBtn.style.position =
        "fixed";


    openBtn.style.left =
        "50%";


    openBtn.style.top =
        "auto";


    openBtn.style.bottom =
        "17%";


    openBtn.style.transform =
        "translateX(-50%)";


    buttonText.textContent =
        "BẮT ĐƯỢC RỒI — MỞ THƯ ❤️";


    gameStatus.textContent =
        "Được rồi... lần này đứng yên cho em bắt ❤️";


    gameStatus.classList.add(
        "active"
    );
}


/* =========================================================
   MỞ THƯ
========================================================= */

function openLetter() {

    if (
        !unlocked
    ) {

        return;
    }


    if (
        !dodgeLocked
    ) {

        return;
    }


    if (
        letterOpened
    ) {

        return;
    }


    letterOpened =
        true;


    intro.style.opacity =
        "0";


    introContent.style.transform =
        "scale(2.8)";


    setTimeout(
        () => {

            letterLayer.classList.add(
                "show"
            );

            letterLayer.setAttribute(
                "aria-hidden",
                "false"
            );


            typeLetter();

        },
        600
    );
}


openBtn.addEventListener(
    "click",
    () => {

        if (
            !unlocked
        ) {

            return;
        }


        if (
            !dodgeLocked
        ) {

            dodgeButton();

            return;
        }


        openLetter();
    }
);


/* =========================================================
   LETTER CONTENT
========================================================= */

const letterParagraphs = [

    `Linh à, ❤️`,

    `Anh không biết phải bắt đầu lá thư này từ đâu, nên anh chỉ muốn nói những điều thật lòng nhất. Có những người bước vào cuộc sống mình rất nhẹ nhàng, nhưng rồi chẳng biết từ lúc nào lại trở thành một phần rất đặc biệt.`,

    `Với anh, em là một người như thế.`,

    `Anh không hứa rằng mọi ngày sau này đều sẽ hoàn hảo. Nhưng anh có thể hứa rằng nếu em cho anh cơ hội, anh sẽ luôn trân trọng những khoảnh khắc có em trong đó.`,

    `Cảm ơn em vì đã xuất hiện. Cảm ơn những nụ cười, những câu chuyện nhỏ, những khoảnh khắc tưởng như bình thường nhưng lại trở thành những điều anh nhớ rất lâu.`,

    `Nếu thế giới này rộng lớn đến mức chúng ta chỉ là hai chấm nhỏ giữa hàng tỷ người, thì anh vẫn thấy thật may mắn vì hai chấm nhỏ ấy đã gặp nhau.`,

    `Anh chỉ muốn em biết rằng: em rất đặc biệt. ❤️`,

    `Mong rằng khi đọc đến đây, em sẽ mỉm cười một chút. Và nếu có thể, hãy giữ nụ cười ấy thật lâu nhé.`,

    `— Dũng ❤️`

];


/* =========================================================
   TYPEWRITER
========================================================= */

async function typeLetter() {

    letterContent.innerHTML =
        "";


    for (
        const paragraph
        of letterParagraphs
    ) {

        const p =
            document.createElement(
                "p"
            );


        if (
            paragraph.includes(
                "em rất đặc biệt"
            )
        ) {

            p.classList.add(
                "special"
            );
        }


        letterContent.appendChild(
            p
        );


        for (
            let i = 0;
            i < paragraph.length;
            i++
        ) {

            p.textContent +=
                paragraph[i];


            await delay(
                paragraph[i] === " "
                    ? 10
                    : 24
            );
        }


        await delay(
            180
        );
    }
}


/* =========================================================
   DELAY
========================================================= */

function delay(
    milliseconds
) {

    return new Promise(
        resolve =>
            setTimeout(
                resolve,
                milliseconds
            )
    );
}


/* =========================================================
   ĐÓNG THƯ
========================================================= */

function closeLetterPanel() {

    letterLayer.classList.remove(
        "show"
    );

    letterLayer.setAttribute(
        "aria-hidden",
        "true"
    );


    setTimeout(
        () => {

            intro.style.opacity =
                "1";

            introContent.style.transform =
                "scale(1)";

            letterOpened =
                false;

        },
        500
    );
}


closeLetter.addEventListener(
    "click",
    closeLetterPanel
);


/* =========================================================
   CLICK NỀN ĐỂ ĐÓNG
========================================================= */

document
    .getElementById(
        "letterBackdrop"
    )
    .addEventListener(
        "click",
        closeLetterPanel
    );


/* =========================================================
   ESC ĐỂ ĐÓNG
========================================================= */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Escape" &&
            letterOpened
        ) {

            closeLetterPanel();
        }
    }
);


/* =========================================================
   MOBILE TOUCH
========================================================= */

openBtn.addEventListener(
    "touchstart",
    () => {

        openBtn.style.filter =
            "brightness(1.25)";
    },
    {
        passive: true
    }
);


openBtn.addEventListener(
    "touchend",
    () => {

        openBtn.style.filter =
            "";
    },
    {
        passive: true
    }
);


/* =========================================================
   GIỮ NÚT SAU RESIZE
========================================================= */

window.addEventListener(
    "resize",
    () => {

        if (
            !dodgeLocked
        ) {

            return;
        }


        openBtn.style.left =
            "50%";


        openBtn.style.top =
            "auto";


        openBtn.style.bottom =
            "17%";


        openBtn.style.transform =
            "translateX(-50%)";
    }
);