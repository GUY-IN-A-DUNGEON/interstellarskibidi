const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
document.getElementById('stars').appendChild(canvas);

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    createStars();
});

const numStars = 200;
const stars = [];
const mouse = { x: canvas.width / 2, y: canvas.height / 2 };

class Star {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.z = Math.random() * canvas.width;
        this.initialZ = this.z;
    }

    update() {
        const dx = mouse.x - (this.x - canvas.width / 2) * (canvas.width / this.z);
        const dy = mouse.y - (this.y - canvas.height / 2) * (canvas.width / this.z);
        const dist = Math.sqrt(dx * dx + dy * dy);

        const moveFactor = Math.min(10, 1 / (this.z / canvas.width));
        this.z -= 2 + moveFactor;
        if (this.z <= 0) {
            this.reset();
        }

        if (dist < 100) {
            this.x += (Math.random() - 0.5) * moveFactor;
            this.y += (Math.random() - 0.5) * moveFactor;
        }
    }

    draw() {
        const x = (this.x - canvas.width / 2) * (canvas.width / this.z);
        const y = (this.y - canvas.height / 2) * (canvas.width / this.z);
        const size = canvas.width / this.z;
        ctx.beginPath();
        ctx.arc(x + canvas.width / 2, y + canvas.height / 2, size, 0, Math.PI * 2);
        ctx.fillStyle = 'white';
        ctx.fill();
    }
}

function createStars() {
    stars.length = 0;
    for (let i = 0; i < numStars; i++) {
        stars.push(new Star());
    }
}

function animate() {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    stars.forEach(star => {
        star.update();
        star.draw();
    });
    requestAnimationFrame(animate);
}

createStars();
animate();

canvas.addEventListener('mousemove', (event) => {
    mouse.x = event.clientX;
    mouse.y = event.clientY;
});
