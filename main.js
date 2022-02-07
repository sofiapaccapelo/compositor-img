const A4_SIZE = {portrait: {x: 2480, y: 3508}, landscape: {x: 3508, y: 2480}};
const A3_SIZE = {portrait: {x: 3508, y: 4961}, landscape: {x: 4961, y: 3508}};

var config = {
    canvasSize = A4_SIZE['landscape'],
    margin: {
        x: 0,
        y: 0
    }
};

var selectedOrientation = 'landscape';
var selectedSize = A4_SIZE;

var canvasSize = A4_SIZE['landscape'];

var files = [];

function onSizeChange(e) {
    const size = e.srcElement.value;
    selectedSize = size === 'A4' ? A4_SIZE : A3_SIZE;
    canvasSize = selectedSize[selectedOrientation];
    updateCanvas();
}

function onOrientationChange(e) {
    const orientation = e.srcElement.value;
    selectedOrientation = orientation;
    canvasSize = selectedSize[selectedOrientation];
    updateCanvas();
}

function updateCanvas() {
    const canvas = document.getElementById("result-canvas");

    canvas.width = canvasSize.x;
    canvas.height = canvasSize.y;
}

function onImageLoad() {
    const fileList = this.files;
    for (let i = 0, numFiles = fileList.length; i < numFiles; i++) {
        const file = fileList[i];
        if (!file.type.startsWith('image/')){ continue }

        const displayImgs = document.getElementById("display-imgs");
        const img = document.createElement("img");
        img.classList.add("loaded-img");
        img.setAttribute("style", "transform: rotate(" + 90 + "deg)");
        img.file = file;
        displayImgs.appendChild(img);
    
        const reader = new FileReader();
        reader.onload = (function(aImg) { return function(e) { aImg.src = e.target.result; }; })(img);
        reader.readAsDataURL(file);

        const imgg = {
            element: null,
            rotated: false
        };


        files.push(img);
    }
}

function onProcess() {
    const imgWidth = canvasSize.x / files.length;
    const canvas = document.getElementById("result-canvas");
    var ctx = canvas.getContext("2d");

    for (let i = 0, numFiles = files.length; i < numFiles; i++) {
        const file = files[i];
        const imgHeight = (imgWidth / file.width) * file.height;

        ctx.drawImage(file, (imgWidth * i), 0, imgWidth, imgHeight);
    }
}

function init() {
    const inputImages = document.getElementById("load-imgs");
    inputImages.addEventListener("change", onImageLoad, false);

    const size = document.getElementById("size");
    size.addEventListener("change", onSizeChange, false);

    const orientation = document.getElementById("orientation");
    orientation.addEventListener("change", onOrientationChange, false);

    const btnProcess = document.getElementById("btn-process");
    btnProcess.addEventListener("click", onProcess, false);

    updateCanvas();
}