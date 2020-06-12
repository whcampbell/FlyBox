let body = document.getElementById("body");
body.style.backgroundColor = "palegreen";
let canvas = document.getElementById("myCanvas");
let context = canvas.getContext("2d");
let button = document.getElementById("button");
let x = 30;
let y = 460;
let dx = 0;
let dy = 0;
let grounded = true;
let lpress = false;
let rpress = false;
let upress = false;
let dpress = false;
let dying = false;
let leftPit = false;
let rockets = 4;
let particles = [];

button.onclick = function() {
    console.log("get jumpin");
    loop();
}

window.onkeydown = function(event) {
    switch (event.keyCode) {
        case 37:
            this.console.log("left");
            lpress = true
            break;
        case 38:
            event.preventDefault();
            this.console.log("up, preventing");
            upress = true;
            break;
        case 39:
            this.console.log("right");
            rpress = true;
            break;
        case 40:
            event.preventDefault();
            this.console.log("down, preventing");
            dpress = true;
            break;
    }
}

window.onkeyup = function(event) {
    switch (event.keyCode) {
        case 37:
            this.console.log("leftup");
            lpress = false;
            break;
        case 38:
            this.console.log("upup");
            upress = false;
            break;
        case 39:
            this.console.log("rightup");
            rpress = false;
            break;
        case 40:
            this.console.log("downup");
            dpress = false;
            break;
    }
}

window.onkeypress = function(event) {
    if (rockets < 1) {
        return;
    }
    switch (event.keyCode) {
        case 97:
            this.console.log("Apress");
            dx -= 3;
            particles.push(new Particle(2));
            particles.push(new Particle(3));
            particles.push(new Particle(4));
            break;
        case 119:
            this.console.log("Wpress");
            dy -= 3;
            particles.push(new Particle(11));
            particles.push(new Particle(12));
            particles.push(new Particle(1));
            break;
        case 100:
            this.console.log("Dpress");
            dx += 3;
            particles.push(new Particle(8));
            particles.push(new Particle(9));
            particles.push(new Particle(10));
            break;
        case 115:
            this.console.log("Spress");
            dy += 3;
            particles.push(new Particle(5));
            particles.push(new Particle(6));
            particles.push(new Particle(7));
            break;
    }
    --rockets;
}

function loop() {
    context.clearRect(0,0,canvas.width, canvas.height);
    stage();
    box();
    jets();
    if (dying) {
        die();
    } else {
        physics();
    }

    window.requestAnimationFrame(loop);
}

function physics() {
    // x axis motion
    if (lpress && grounded) {
        dx -= .5;
        if (dx < -3) {
            dx = -3;
        }
    } else if (rpress && grounded) {
        dx += .5;
        if (dx > 3) {
            dx = 3;
        }
    } else if (grounded) {
        dx = dx / -5;
        rockets = 4;
    }

    if (grounded && pitCheck()) {
        dying = true;
        grounded = false;
        if (x < 160) {
            leftPit = true;
        }
    }

    // jump
    if (upress && grounded) {
        dy = -3;
        grounded = false;
    }

    // gravity and y axis motion
    if (y < 460) {
        dy += .1;
    } else if (y > 460) {
        if (x < 80) {
            y = 460;
            grounded = true;
        } else if (x > 120 && x < 240) {
            y = 460;
            grounded = true;
        } else if (x > 280) {
            y = 460;
            grounded = true;
        } else {
            dying = true;
            if (x < 160) {
                leftPit = true;
            }
        }
    } else if (y == 460);

    x += dx;
    if (x < 0) {
        x = 0;
    }
    if (x > 360) {
        x = 360;
    }
    y += dy;
}

function die() {
    x += dx;
    if (leftPit) {
        if (x < 80) {
            x = 80;
        } else if (x > 120) {
            x = 120;
        }
    } else {
        if (x < 240) {
            x = 240;
        } else if (x > 280) {
            x = 280;
        }
    }

    dy += .1
    y += dy;

    if (y > 700) {
        dying = false;
        leftPit = false;
        grounded = true;
        x = 30;
        y = 460;
        dx = 0;
        dy = 0;
    }
    
}

function pitCheck() {
    if (x > 80 && x < 120) {
        return true;
    }
    if (x > 240 && x < 280) {
        return true;
    }
}

function stage() {
    context.fillRect(0, 500, 80, 100)
    context.fillRect(160, 500, 80, 100);
    context.fillRect(320, 500, 80, 100);
}

function box() {
    context.save();
    context.fillStyle = "red";
    context.fillRect(x, y, 40, 40);
    context.restore();
}

function jets() {
    context.save();
    context.fillStyle = "red";

    for (let i = particles.length - 1; i >= 0; --i) {
        /*
        if (typeof particles[i] == "undefined") {
            continue;
        }
        */
        particles[i].x += 3 * particles[i].dx;
        particles[i].y += 3 * particles[i].dy;
        if (particles[i].x > 400 || particles[i].x < 0 
            || particles[i].y > 600 || particles[i].y < 0) {
                particles.splice(i, 1);
                continue;
        }
        context.beginPath();
        context.arc(particles[i].x, particles[i].y, 3, 0, Math.PI * 2);
        context.closePath();
        context.fill();
    }

    context.restore();
}


class Particle {
    constructor(direction) {
        this.direction = direction;
        switch (direction) {
            case 1:
                this.dx = .5;
                this.dy = .866;
                break;
            case 2:
                this.dx = .866;
                this.dy = .5;
                break;
            case 3:
                this.dx = 1;
                this.dy = 0;
                break;
            case 4:
                this.dx = .866;
                this.dy = -.5;
                break;
            case 5:
                this.dx = .5;
                this.dy = -.866;
                break;
            case 6:
                this.dx = 0;
                this.dy = -1;
                break;
            case 7:
                this.dx = -.5;
                this.dy = -.866;
                break;
            case 8:
                this.dx = -.866;
                this.dy = -.5;
                break;
            case 9:
                this.dx = -1;
                this.dy = 0;
                break;
            case 10:
                this.dx = -.866;
                this.dy = .5;
                break;
            case 11:
                this.dx = -.5;
                this.dy = .866;
                break;
            case 12:
                this.dx = 0;
                this.dy = 1;
                break;
        }
        this.x = x + 20;
        this.y = y + 20;
    }
}