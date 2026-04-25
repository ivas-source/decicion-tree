import { buildTree, predict } from './tree.js'

const startingButton = document.getElementById('start-button')
const drawingButton = document.getElementById('draw-button')
const n = 100;
const canvas = document.getElementById('canva');
const ctx = canvas.getContext('2d');
const w = canvas.width;
const h = canvas.height;
const dataset = []

for (let i = 0; i < n; i++){
    dataset.push({x: Math.floor(Math.random() * 50), y: Math.floor(Math.random() * 50), label: Math.floor(Math.random() * 2) })
}
console.log(dataset)
let smartDataset = buildTree(dataset, 'label')
console.log(smartDataset)

let thresholds = [];


function collectThresholds(node) {
    let left = null;
    let right = null;
    if (typeof node === 'object') {
        thresholds.push({feature: node.feature, threshold: node.threshold })
        left = node.left
        right = node.right
    }
    else {
        return 0
    }
    collectThresholds(left)
    collectThresholds(right)

}
collectThresholds(smartDataset);

function drawCoordinateAxes() {
    ctx.beginPath();
    ctx.moveTo(0, 300);
    ctx.lineTo(300,300);
    ctx.moveTo(0, 300);
    ctx.lineTo(0, 0);
    ctx.stroke();
}

function drawThresholds(){
    for (const point of thresholds){
        let canvasX = point.threshold * 6
        if (point.feature == 'x'){
            ctx.moveTo(canvasX, 0);
            ctx.lineTo(canvasX, 300);
            ctx.stroke();
        }
        else if (point.feature == 'y'){
            let canvasY = point.threshold * 6
            ctx.moveTo(0, canvasY)
            ctx.lineTo(300, canvasY);
            ctx.stroke();
        }
    }
}

function colourResults() {
    for (let i = 0; i < w; i++ ){
        for (let j = 0; j < h; j++){
            let point = {x: (i / 6), y: (j / 6)}
            if (predict(smartDataset, point) == 0){
                ctx.beginPath();
                ctx.fillStyle ='red';
                ctx.fillRect(i, j, 1, 1);
            }
            else{
                ctx.beginPath();
                ctx.fillStyle = 'yellow'
                ctx.fillRect(i, j, 1, 1);
            }
        }
    }
}


drawingButton.onclick = () => {
    drawCoordinateAxes();
    drawThresholds();
}
