class Player extends GameObject {
    constructor(master, x, y, name, level) {
        super(master, x, y, 66-20, 92-17);
        this.image_src = "img/sprites/alienPink.png";
        this.image_src_flipped = "img/sprites/alienPink_flipped.png";
        this.image = new Image();
        this.image.src = this.image_src;

        this.vx = Math.round(5*(Math.random() - 0.5));
        this.vy = 0;
        this.name = name;
        this.level = level;
        this.is_flipped = false;
        this.keydown = {
            left: false,
            right: false,
            up: false,
            down: false,
        }
        this.keys = {
            left: "ArrowLeft",
            right: "ArrowRight",
            up: "ArrowUp",
            down: "ArrowDown",
        };
    }
    handleKeys(event) {
        if (event.type === "keydown") {
            if (event.code == this.keys.up && !this.keydown.up && this.is_standing) {
                this.keydown.up = true;
                this.jump();
            } else if (event.code == this.keys.left) {
                this.keydown.left = true;
            } else if (event.code == this.keys.right) {
                this.keydown.right = true;
            } else if (event.code == this.keys.down) {
                this.keydown.down = true;
            }
        } else if (event.type === "keyup") {
            if (event.code == this.keys.up) {
                this.keydown.up = false;
            } else if (event.code == this.keys.left) {
                this.keydown.left = false;
            } else if (event.code == this.keys.right) {
                this.keydown.right = false;
            } else if (event.code == this.keys.down) {
                this.keydown.down = false;
            }
        }
    }
    get_standing() {
        var prevbot = this.bottom;
        this.bottom += 1;
        var collisions = this.level.collide(this);
        var it = collisions.next();
        while (!it.done) {
            if (it.value.collectable) {
                // level.remove(it.value);
            } else if (prevbot <= it.value.top) {
                this.bottom -= 1;
                return true;
            }
            it = collisions.next();
        }
        this.bottom -= 1;
        return false;
    }
    jump() {
        this.vy = -15;
    }
    accelerate() {
        var MAXV = 5;
        if (this.keydown.left && !this.keydown.down) {
            this.vx = (this.vx+MAXV)*0.9 - MAXV;
            this.is_flipped = true;
        } else if (this.keydown.right && !this.keydown.down) {
            this.vx = (this.vx-MAXV)*0.9 + MAXV;
            this.is_flipped = false;
        } else {
            this.vx *= 0.7;
            if (Math.abs(this.vx) < 0.5) this.vx = 0;
        }
        this.vy += 2;
        if (this.keydown.up && !this.keydown.down) {
            this.vy -= 1
        }
    }
    update() {
        this.is_standing = this.get_standing();
        // Adjust the velocities
        this.accelerate();

        // Save previous position
        var prevrect = this.rect();
        // Handle y direction first
        this.y += this.vy;
        this.x += this.vx;

        if (this.left < 0) {
            this.vx = 0;
            this.left = 0;
        }
        if (this.right > this.master.canvas.width) {
            this.vx = 0;
            this.right = this.master.canvas.width;
        }
        // if (this.vx < 0) {
        //     this.is_flipped = true;
        // }
        // if (this.vx > 0) {
        //     this.is_flipped = false;
        // }

        var collisions = this.level.collide(this);
        var it = collisions.next();
        while (!it.done) {
            if (it.value.collectable) {
                level.remove(it.value);
            } else if (prevrect.bottom <= it.value.top) {
                this.bottom = it.value.top;
                this.vy = 0;
            }
            it = collisions.next();
        }

        // Prepare animations
        this.set_animation()
    }
    set_animation() {
        if (this.keydown.down) {
            this.image_crop = sprite_ani.pink.duck;
        } else if (!this.is_standing) {
            this.image_crop = sprite_ani.pink.jump;
        } else if (this.vx != 0) {
            this.image_crop = sprite_ani.pink["walk" + (1+Math.round(this.x/20) % 2)];
        } else {
            this.image_crop = sprite_ani.pink.stand2;
        }
        if (this.is_flipped) {
            this.image_crop = sprite_ani.flip(256, this.image_crop);
            this.image.src = this.image_src_flipped;
        } else {
            this.image.src = this.image_src;
        }
        this.y = this.bottom - this.image_crop.h + this.image_crop.tpd + this.image_crop.bpd;
        this.h = this.image_crop.h - this.image_crop.tpd - this.image_crop.bpd;
        this.x = this.right - this.image_crop.w + this.image_crop.lpd + this.image_crop.rpd;
        this.w = this.image_crop.w - this.image_crop.lpd - this.image_crop.rpd;
    }
    // draw() {
    //     this.master.fillStyle = this.color;
    //     this.master.fillRect(this.x, this.y, this.w, this.h);
    //     var ani = sprite_ani.pink.stand2;
    //     if (this.vx != 0) {
    //         ani = sprite_ani.pink["walk" + (1+Math.round(this.x/20) % 2)];
    //     }
    //     this.master.drawImage(this.image, ani.x, ani.y, ani.w, ani.h,
    //                           this.x-ani.lpd, this.y-ani.tpd,
    //                           this.w+ani.lpd+ani.rpd, this.h+ani.tpd+ani.bpd);
    // }
}

class Platform extends(GameObject) {
    constructor(master, x, y, w, h, color) {
        super(master, x, y, w, h);
        this.color = color;
    }

}

class Coin extends(GameObject) {
    constructor(master, x, y) {
        var size = 36;
        super(master, x, y, size, size);
        this.collectable = true;
        this.color = "#FFD700";
        this.image = new Image();
        this.image.src = "img/sprites/items_spritesheet.png"
        this.image_crop = sprite_ani.items.coinGold;
    }
}
