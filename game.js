let body = document.getElementById("body");
body.style.backgroundColor = "palegreen";
let canvas = document.getElementById("myCanvas");
let context = canvas.getContext("2d");
let button = document.getElementById("button");
let playing = false;
let x = 30;
let y = 460;
let dx = 0;
let dy = 0;
let grounded = true;
let lpress = false;
let rpress = false;
let upress = false;
let dpress = false;
let wpress = false;
let apress = false;
let spress = false;
let depress = false;
let leftPit = false;
let rockets = 4;
let particles = [];
let tiles = null;

button.onclick = function() {
    if (playing) {
        return;
    }
    playing = true;
    console.log("get jumpin");
    constructTiles();
    loop();
}

window.onkeydown = function(event) {
    if (!playing) {
        return;
    }
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
        case 65:
            this.console.log("Apress");
            if (apress || rockets < 1) {
                break;
            }
            dx -= 3;
            particles.push(new Particle(2));
            particles.push(new Particle(3));
            particles.push(new Particle(4));
            apress = true;
            --rockets;
            break;
        case 87:
            this.console.log("Wpress");
            if (wpress || rockets < 1) {
                break;
            }
            dy -= 3;
            grounded = false;
            particles.push(new Particle(11));
            particles.push(new Particle(12));
            particles.push(new Particle(1));
            wpress = true;
            --rockets;
            break;
        case 68:
            this.console.log("Dpress");
            if (depress || rockets < 1) {
                break;
            }
            dx += 3;
            particles.push(new Particle(8));
            particles.push(new Particle(9));
            particles.push(new Particle(10));
            depress = true;
            --rockets;
            break;
        case 83:
            this.console.log("Spress");
            if (spress || rockets < 1) {
                break;
            }
            dy += 3;
            particles.push(new Particle(5));
            particles.push(new Particle(6));
            particles.push(new Particle(7));
            spress = true;
            --rockets;
            break;
        default :
            this.console.log(event.keyCode);
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
        case 65:
            apress = false;
            break;
        case 87:
            wpress = false;
            break;
        case 68:
            depress = false;
            break;
        case 83:
            spress = false;
            break;
    }
}

function loop() {
    context.clearRect(0,0,canvas.width, canvas.height);
    stage();
    box();
    jets();
    physics();
    checkTiles();
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

    // jump
    if (upress && grounded) {
        grounded = false;
        dy = -3;
    }

    // gravity and y axis motion
    dy += .1;
    if (dy > .2) {
        grounded = false;
    }

}

function checkTiles() {
    let copyX = x + dx;
    if (collide([copyX, y])) {
        dx = 0;
    }

    let copyY = y + dy;
    if (collide([x, copyY])) {
        if (dy > 0) {
            grounded = true;
        }
        dy = 0;
        
    }

    x += dx;
    if (x < 0) {
        x = 0;
        dx = 0;
    }
    if (x > 360) {
        x = 360;
        dx = 0;
    }
    y += dy;
    if (y > 600) {
        for (let i = 1; i <= 12; ++i) {
            particles.push(new Particle(i, x + 20, y - 21));
        }
        y = 460;
        x = 30;
    }

}

function collide(position) {
    let left = Math.floor(position[0] / 40);
    let right = Math.floor((position[0] + 40) / 40);
    let top = Math.floor(position[1] / 40);
    let bottom = Math.floor((position[1] + 40) / 40);

    if (left < 0) {left = 0}
    if (right > 9) {right = 9}
    if (top < 0) {top = 0}
    if (bottom > 14) {bottom = 14}

    for (let i = top; i <= bottom; ++i) {
        for (let j = left; j <= right; ++j) {
            if (tiles[i][j] == 1) {
                return true;
            }
        }
    }

    return false;
}

function stage() {
    context.fillRect(0, 520, 80, 80)
    context.fillRect(160, 520, 80, 80);
    context.fillRect(320, 520, 80, 80);
    context.fillRect(80, 280, 80, 80);
    context.fillRect(240, 120, 80, 80);
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

function constructTiles() {
    tiles = [[0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,1,1,0,0],
            [0,0,0,0,0,0,1,1,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,1,1,0,0,0,0,0,0],
            [0,0,1,1,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [1,1,0,0,1,1,0,0,1,1],
            [1,1,0,0,1,1,0,0,1,1],
            ]
}


class Particle {
    constructor(direction, jetX, jetY) {
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
        if (jetX) {
            this.x = jetX;
        } else {
            this.x = x + 20;
        }
        if (jetY) {
            this.y = jetY;
        } else {
            this.y = y + 20;
        }
    }
}