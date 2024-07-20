const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const dots = [];
const numDots = 100;
const maxDistance = 100; // Maximum distance for lines to disappear
const fadeSpeed = 0.02; // Speed at which the dots fade in and out
const repelDistance = 150; // Distance at which dots move away from the cursor

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

function Dot(x, y) {
    this.x = x;
    this.y = y;
    this.radius = 2;
    this.opacity = 1;
    this.fadeIn = true;
}

Dot.prototype.draw = function () {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
    ctx.fill();
};

Dot.prototype.update = function (mouseX, mouseY) {
    const dx = mouseX - this.x;
    const dy = mouseY - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance < repelDistance) {
        this.x -= dx / distance;
        this.y -= dy / distance;
    }

    if (this.fadeIn) {
        this.opacity += fadeSpeed;
        if (this.opacity >= 1) this.fadeIn = false;
    } else {
        this.opacity -= fadeSpeed;
        if (this.opacity <= 0) this.fadeIn = true;
    }
    
    this.draw();
};

function Line(dot1, dot2) {
    this.dot1 = dot1;
    this.dot2 = dot2;
}

Line.prototype.draw = function () {
    const dx = this.dot1.x - this.dot2.x;
    const dy = this.dot1.y - this.dot2.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance < maxDistance) {
        ctx.beginPath();
        ctx.moveTo(this.dot1.x, this.dot1.y);
        ctx.lineTo(this.dot2.x, this.dot2.y);
        ctx.strokeStyle = `rgba(255, 255, 255, ${(1 - distance / maxDistance)})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
    }
};

function init() {
    for (let i = 0; i < numDots; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        dots.push(new Dot(x, y));
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < dots.length; i++) {
        dots[i].update(mouseX, mouseY);
    }

    for (let i = 0; i < dots.length; i++) {
        for (let j = i + 1; j < dots.length; j++) {
            new Line(dots[i], dots[j]).draw();
        }
    }

    requestAnimationFrame(animate);
}

let mouseX = canvas.width / 2;
let mouseY = canvas.height / 2;

window.addEventListener('mousemove', (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;
});

init();
animate();
