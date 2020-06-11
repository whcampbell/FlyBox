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

button.onclick = function() {
    console.log("get jumpin");
    this.loop();
}

window.onkeydown = function(event) {
    switch (event.keyCode) {
        case 37:
            this.console.log("left");
            lpress = true
            break;
        case 38:
            this.console.log("up");
            upress = true;
            break;
        case 39:
            this.console.log("right");
            rpress = true;
            break;
        case 40:
            this.console.log("down");
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
    switch (event.keyCode) {
        case 97:
            this.console.log("Apress");
            break;
        case 119:
            this.console.log("Wpress");
            break;
        case 100:
            this.console.log("Dpress");
            break;
        case 115:
            this.console.log("Spress");
            break;
    }
}

function loop() {
    context.clearRect(0,0,canvas.width, canvas.height);
    stage();
    box();
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
    }

    if (grounded && pitCheck()) {
        dying = true;
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
