var canvas = document.querySelector("#rainbow");
var ctx = canvas.getContext("2d");

ctx.font = "50 80px sans-serif";
ctx.lineWidth = 2;
var str = "DINGAN";
var strwidth = ctx.measureText(str).width;

var width = canvas.width;


var c = 0;
var color = 0;
var img;

(function a() {
    img = ctx.getImageData(0, 0, width, width);
    ctx.putImageData(img, 0, 10);
    ctx.save();
    ctx.translate((width / 2), width / 2);
    ctx.rotate(Math.PI * (c++/200));

    ctx.fillStyle = 'hsla(' + (color = color + 4 % 360) + ', 100%, 50%, 1)';
    ctx.fillText("DINGAN", -(strwidth / 2), 20);
    ctx.strokeText("DINGAN", -(strwidth / 2), 20);

    ctx.restore();


    requestAnimationFrame(a);
})();


//https://codepen.io/Nvagelis/pen/yaQGAL