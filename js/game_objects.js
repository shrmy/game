class Player extends GameObject {
    constructor(master, x, y, w, h, name, level) {
        super(master, x, y, w, h);
        this.vx = Math.round(5*(Math.random() - 0.5));
        this.vy = 0;
        this.name = name;
        this.level = level;
        this.keydown = {
            left: false,
            right: false,
            up: false,
            down: false,
        }
    }
    handleKeys(event) {
        if (event.type === "keydown") {
            if (event.code == "ArrowUp" && !this.keydown.up) {
                this.keydown.up = true;
                this.jump();
            } else if (event.code == "ArrowLeft") {
                this.keydown.left = true;
            } else if (event.code == "ArrowRight") {
                this.keydown.right = true;
            }
        } else if (event.type === "keyup") {
            if (event.code == "ArrowUp") {
                this.keydown.up = false;
            } else if (event.code == "ArrowLeft") {
                this.keydown.left = false;
            } else if (event.code == "ArrowRight") {
                this.keydown.right = false;
            }
        }

        if (this.keydown.left) {
            this.vx = -3;
        } else if (this.keydown.right) {
            this.vx = 3;
        } else {
            this.vx = 0;
        }
    }
    jump() {
        this.vy = -10;
    }
    update() {
        // Handle y direction first
        this.vy += 1;
        var prevbot = this.bottom;
        this.y += this.vy;
        var collisions = this.level.collide(this);
        var it = collisions.next();
        // console.log(it);
        while (!it.done) {
            // console.log(it);
            if (prevbot <= it.value.top) {
                this.bottom = it.value.top;
                this.vy = 0;
            }
            it = collisions.next();
        }

        this.x += this.vx;

        // if (this.bottom > this.master.canvas.height) {
        //     this.vy = 0;
        //     this.bottom = this.master.canvas.height;
        // }
        if (this.left < 0) {
            this.vx = 0;
            this.left = 0;
        }
        if (this.right > this.master.canvas.width) {
            this.vx = 0;
            this.right = this.master.canvas.width;
        }
    }
}

class Platform extends(GameObject) {
    constructor(master, x, y, w, h, color) {
        super(master, x, y, w, h);
        this.color = color;
    }

}

class Coin extends(GameObject) {
    constructor(master, x, y, w, h) {
        super(master, x, y, w, h);
        this.color = "#FFD700";
    }
}
