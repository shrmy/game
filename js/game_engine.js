/* Made by Maks Kolman for Celtra HTML5 game challaenge */

/* A general game object. Will be used for player, bullets, coins,
platforms,... It has implemented collision detection */
class GameObject {
    /* Contructs a new object
    Params:
        master: canvas object on which to draw the object
        x: the x coordinate of the left border of the object
        y: the y coordinate of the top border of the object
        w: width of the object
        h: height of the object
    */
    constructor(master, x, y, w, h) {
        // save the canvas object
        this.master = master;
        // Set coordinates
        this.x = x || 0;
        this.y = y || 0;
        this.w = w || 0;
        this.h = h || 0;
        // For drawing
        this.color = "#28abe3";
    }
    // Quick acces to all four coordinates of the object
    get top() {return this.y;}
    set top(val) {this.y = val;}
    get left() {return this.x;}
    set left(val) {this.x = val;}
    get bottom() {return this.y + this.h;}
    set bottom(val) {this.y = val - this.h;}
    get right() {return this.x + this.w;}
    set right(val) {this.x = val - this.w;}
    rect(){
        return {bottom: this.bottom, top: this.top,
                left: this.left, right: this.right}
    }

    // Do all the physics needed in one frame
    // dt is the actual time we want to simulate in a single step
    update(dt) {
        throw "You have to implement the update method before you can use it."
    }
    // Draw this object on the screen
    draw() {
        if (this.image){
            // this.master.fillStyle = this.color;
            // this.master.fillRect(this.x, this.y, this.w, this.h);
            // this.master.fill();
            var x = 0, y = 0, w = this.w, h = this.h,
                lpd = 0, rpd = 0, tpd = 0, bpd = 0;
            if (this.image_crop) {
                x = this.image_crop.x;
                y = this.image_crop.y;
                w = this.image_crop.w;
                h = this.image_crop.h;
                lpd = this.image_crop.lpd || 0;
                rpd = this.image_crop.rpd || 0;
                tpd = this.image_crop.tpd || 0;
                bpd = this.image_crop.bpd || 0;
            }
            if (w - lpd - rpd != this.w) {
                console.warn("Widths do not go well together:", w, lpd, rpd, this.w);
            }
            if (h - tpd - bpd != this.h) {
                console.warn("Heights do not go well together:", h, tpd, bpd, this.h);
            }
            this.master.drawImage(this.image, x, y, w, h, this.x - lpd,
                                  this.y - tpd, this.w + rpd + lpd,
                                  this.h + bpd + tpd);

        } else {
            this.master.fillStyle = this.color;
            this.master.fillRect(this.x, this.y, this.w, this.h);
        }
    }
}

/* This will hold multiple game objects. It should be used to ease collision
detection with multiple targets */
class ObjectGroup {
    constructor() {
        this.objects = [];
    }
    add(obj) {
        this.objects.push(obj);
    }
    draw() {
        for (var i = 0; i < this.objects.length; i++) {
            this.objects[i].draw();
        }
    }
    remove(obj) {
        var ax;
        while ((ax = this.objects.indexOf(obj)) !== -1) {
            this.objects.splice(ax, 1);
        }
    }
    *collide(obj) {
        var l = obj.left, r = obj.right, t = obj.top, b = obj.bottom;
        for (var i = 0; i < this.objects.length; i++) {
            var o = this.objects[i];
            if (o.left <= r && o.right >= l && o.top <= b && o.bottom >= t) {
                yield o;
            }
        }
    }
}

function main_loop(FPS, frame_function) {
    var frame_duration = 1000/FPS;
    var prev_frame_end = (new Date()).getTime();
    var warning = 10;
    function wrapper() {
        frame_function();
        var frame_end = (new Date()).getTime();
        if (warning && 1000/(frame_end - prev_frame_end) < 0.9*FPS) {
            warning -= 1;
            console.warn("We cannot provide a smooth animation.",
                        "The best FPS we can manage is", 1000/(frame_end - prev_frame_end));
        }
        prev_frame_end =  frame_end;
        setTimeout(wrapper, Math.max(0, frame_duration - frame_end + prev_frame_end));
    }
    setTimeout(wrapper, 0);
}

