const canvas = document.querySelector("#matrix");
const ctx = canvas.getContext("2d");

const characters = "アイウエオカキクケコ0123456789";
const fontSize = 16;

let columns;
let drops;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    columns = Math.floor(canvas.width / fontSize);
    drops = Array(columns).fill(1);
}

function drawMatrix() {
    ctx.fillStyle = "rgba(0, 0, 0, 0.08)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#00ff41";
    ctx.font = `${fontSize}px monospace`;

    drops.forEach((y, index) => {
        const character =
            characters[Math.floor(Math.random() * characters.length)];

        ctx.fillText(character, index * fontSize, y * fontSize);

        if (y * fontSize > canvas.height && Math.random() > 0.975) {
            drops[index] = 0;
        }

        drops[index]++;
    });

    requestAnimationFrame(drawMatrix);
}

window.addEventListener("resize", resizeCanvas);

resizeCanvas();
drawMatrix();
