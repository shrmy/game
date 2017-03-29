var canvas = document.getElementById("game").getContext("2d");

var H = canvas.canvas.height, W = canvas.canvas.width;
var level = new ObjectGroup();
level.add(new Platform(canvas, 0, H-5, W, 10, "green"))
level.add(new Platform(canvas, 15, H-110, 100, 5, "green"))
level.add(new Platform(canvas, 250, H-200, 100, 5, "green"))
level.add(new Platform(canvas, 500, H-200, 100, 5, "green"))
level.add(new Coin(canvas, 15, H-100))
for (var i = 0; i < 15; i++) {
    for (var j = 0; j < 7; j++) {
        level.add(new Coin(canvas, i*40, j*40));
    }
}

var morio = new Player(canvas, 100, 10, "Morio", level);

document.addEventListener("keydown", function(event) {
    morio.handleKeys(event);
});
document.addEventListener("keyup", function(event) {
    morio.handleKeys(event);
});
// var logi = new Player(canvas, 100, 50, 50, 50, "logi");
console.log(morio);
// console.log(logi)
function step() {
    canvas.fillStyle = "#1fda9a";
    canvas.fillRect(0, 0, W, H);
    morio.update(level);
    level.draw();
    morio.draw();
}
main_loop(30, step);
