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
let rockets = 0;
let currRockets = 0;
let collectible = [1,1];
let particles = [];
let tiles = null;
let coinTimer = 0;
let done = false;
let startTime = 0

let rocketImg = new Image();
rocketImg.src = "./Sauce_Rocket.png"
let coinFront = new Image();
coinFront.src = "./Coin_Front.png"
let coinSide = new Image();
coinSide.src = "./Coin_Side.png"

button.onclick = function() {
    if (playing) {
        return;
    }
    playing = true;
    console.log("get jumpin");
    constructTiles();
    startTime = performance.now();
    loop();
}

window.onkeydown = function(event) {
    if (!playing) {
        return;
    }
    switch (event.keyCode) {
        case 37:
            lpress = true
            break;
        case 38:
            event.preventDefault();
            upress = true;
            break;
        case 39:
            rpress = true;
            break;
        case 40:
            event.preventDefault();
            dpress = true;
            break;
        case 65:
            if (apress || currRockets < 1) {
                break;
            }
            dx -= 3;
            particles.push(new Particle(2));
            particles.push(new Particle(3));
            particles.push(new Particle(4));
            apress = true;
            --currRockets;
            break;
        case 87:
            if (wpress || currRockets < 1) {
                break;
            }
            dy -= 3;
            grounded = false;
            particles.push(new Particle(11));
            particles.push(new Particle(12));
            particles.push(new Particle(1));
            wpress = true;
            --currRockets;
            this.console.log(currRockets);
            break;
        case 68:
            if (depress || currRockets < 1) {
                break;
            }
            dx += 3;
            particles.push(new Particle(8));
            particles.push(new Particle(9));
            particles.push(new Particle(10));
            depress = true;
            --currRockets;
            break;
        case 83:
            if (spress || currRockets < 1) {
                break;
            }
            dy += 3;
            particles.push(new Particle(5));
            particles.push(new Particle(6));
            particles.push(new Particle(7));
            spress = true;
            --currRockets;
            break;
        default :
            this.console.log(event.keyCode);
            break;
    }
}

window.onkeyup = function(event) {
    switch (event.keyCode) {
        case 37:
            lpress = false;
            break;
        case 38:
            upress = false;
            break;
        case 39:
            rpress = false;
            break;
        case 40:
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
    rocketCounter();
    physics();
    checkTiles();
    collectibles();
    ++coinTimer;
    console.log(coinTimer);
    if (coinTimer > 55) {
        animateCoins();
    }
    if (done) {
        win();
    } else {
        window.requestAnimationFrame(loop);
    }
}

function physics() {
    // grounded x axis motion
    if (lpress && grounded) {
        dx -= .5;
        if (dx < -3) {
            dx = -3;
        }
        currRockets = rockets;
    } else if (rpress && grounded) {
        dx += .5;
        if (dx > 3) {
            dx = 3;
        }
        currRockets = rockets;
    } else if (grounded) {
        dx = dx / 1.5;
        currRockets = rockets;
    }

    // jump
    if (upress && grounded) {
        grounded = false;
        dy = -3;
    }

    // gravity
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
        rockets = 0;
        currRockets = 0;
        console.log("BOOOSHH");
    } else if (y < 0) {
        y = 0;
        dy = 0;
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
            } else if (tiles[i][j] == 2 || tiles[i][j] == 3) {
                tiles[i][j] = 0;
            }
            if (tiles[i][j] >= 4) {
                rockets += 1;
                currRockets += 1;
                console.log("rocket get!");
                tiles[i][j] = 0;
                collectible = null;
            } else if (tiles[i][j] == -1) {
                rockets += 1;
                tiles[i][j] = 0;
            }
        }
    }

    return false;
}

function stage() {
    for (let i = 0; i <= 14; ++i) {
        for (let j = 0; j <= 9; ++j) {
            if (tiles[i][j] == 1) {
                context.fillRect(j * 40, i * 40, 40, 40);
            } else if (tiles[i][j] == 2) {
                context.drawImage(coinFront, j * 40, i * 40);
            } else if (tiles[i][j] == 3) {
                context.drawImage(coinSide, j * 40, i * 40);
            }
            if (tiles[i][j] >= 4 || tiles[i][j] == -1) {
                context.drawImage(rocketImg, j * 40, i * 40);
            }
        }
    }
}

function collectibles() {
    if (collectible) {
        tileX = collectible[1];
        tileY = collectible[0];
        tiles[tileY][tileX] += 4;
        if (tiles[tileY][tileX] > 800) {
            collectible = null;
            tiles[tileY][tileX] = 0;
        }
    } else {
        let randX = 0;
        let randY = 14;
        try {
            while (tiles[randY][randX] > 0) {
                randX = Math.floor(Math.random() * 10);
                if (rockets < 2) {
                    randY = Math.floor(Math.random() * 8) + 6;
                } else {
                    randY = Math.floor(Math.random() * 15);
                }
            }
        } catch (exception) {
            for (let i = 0; i < 15; ++i) {
                console.log(tiles[i].toString());
            }
            throw "you're bad";
        }
        collectible = [randY, randX];
    }

}

function animateCoins() {
    console.log("Animating Coins");
    let coinCounter = 0;
    for (let i = 0; i <= 14; ++i) {
        for (let j = 0; j <= 9; ++j) {
            if (tiles[i][j] == 2) {
                ++coinCounter;
                tiles[i][j] = 3;
            } else if (tiles[i][j] == 3) {
                ++coinCounter;
                tiles[i][j] = 2;
            }
        }
    }
    console.log(coinCounter);
    if (coinCounter == 0) {
        done = true;
    }
    coinTimer = 0;
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

function rocketCounter() {
    context.save()
    context.fillStyle = "red";
    context.font = "22px Arial";
    context.fillText("Rockets", 320, 550);
    context.fillText(currRockets.toString(), 355, 590);
    context.restore();
}

function constructTiles() {
    tiles = [[2,3,0,0,0,0,0,0,2,3],
            [0,0,0,0,0,0,2,2,0,0],
            [0,0,0,0,0,0,3,3,0,0],
            [0,0,0,0,0,0,1,1,0,0],
            [0,0,0,0,0,0,1,1,0,0],
            [0,0,0,0,0,0,2,3,0,0],
            [0,0,2,2,0,0,0,0,0,0],
            [0,0,1,1,0,0,0,0,0,0],
            [0,0,1,1,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,3,3],
            [0,0,0,0,2,3,0,0,2,-1],
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

function win() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.font = "30px Arial";
    context.fillText("Got 'em all!", 130, 200);
    let time = (performance.now() - startTime) / 1000;
    time = Math.trunc(time);
    let timeString = time.toString();
    context.fillText("Time: " + timeString + " seconds", 90, 400);
    context.fillText("Reload to try for better", 60, 500);
}