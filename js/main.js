var canvas = document.getElementById("game").getContext("2d");
var H = canvas.canvas.height, W = canvas.canvas.width;
var level = new ObjectGroup();
level.add(new Platform(canvas, 0, H-5, W, 10, "green"))
level.add(new Platform(canvas, 10, H-50, 50, 5, "green"))

var morio = new Player(canvas, 100, 10, 10, 20, "Morio", level);

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
    canvas.fillRect(0, 0, 500, 500);
    morio.update(level);
    level.draw();
    morio.draw();
}
main_loop(30, step);
