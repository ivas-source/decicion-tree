import { buildTree, predict } from './tree.js'

const startingButton = document.getElementById('start-button')
const drawingButton = document.getElementById('draw-button')
const n = 20;
const canvas = document.getElementById('canva');
const ctx = canvas.getContext('2d');
const w = canvas.width;
const h = canvas.height;
const dataset = []

for (let i = 0; i < n; i++){
    dataset.push({x: Math.random() * 50, y: Math.random() * 50, label: Math.floor(Math.random() * 2) })
}
console.log(dataset)
let smartDataset = buildTree(dataset, 'label')
console.log(smartDataset)

let thresholds = [];


function collectThresholds(node, xMin = 0, xMax = 50, yMin = 0, yMax = 50) {
    let left = null;
    let right = null;
    if (typeof node === 'object') {
        thresholds.push({feature: node.feature, threshold: node.threshold, xMin, xMax, yMin, yMax })
        left = node.left
        right = node.right

        if (node.feature == 'x'){
            collectThresholds(left, xMin, node.threshold, yMin, yMax)   
            collectThresholds(right, node.threshold, xMax, yMin, yMax)
        }
        else if (node.feature == 'y'){
            collectThresholds(left, xMin, xMax, yMin, node.threshold)   
            collectThresholds(right, xMin, xMax, node.threshold, yMax)
        }
    }
    else {
        return 0
    }
}
collectThresholds(smartDataset);
console.log(thresholds);


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
            ctx.moveTo(canvasX, (50 - point.yMin) * 6);
            ctx.lineTo(canvasX, (50 - point.yMax) * 6);
            ctx.stroke();
        }
        else if (point.feature == 'y'){
            let canvasY = (50 - point.threshold) * 6
            ctx.moveTo(point.xMin * 6, canvasY)
            ctx.lineTo(point.xMax * 6, canvasY);
            ctx.stroke();
        }
    }
}
console.log(thresholds)

function drawPoints(){
    for (const point of dataset){
        let canvasX = point.x * 6;
        let canvasY = (50 - point.y) * 6;
        ctx.beginPath();
        ctx.arc(canvasX, canvasY, 2, 0, Math.PI * 2);
        ctx.fillStyle = 'black';
        ctx.fill();
    }
}




function colourResults() {
    for (let i = 0; i < w; i++ ){
        for (let j = 0; j < h; j++){
            let point = {x: (i / 6), y: (50 - j / 6)}
            if (predict(smartDataset, point) == 0){
                ctx.beginPath();
                ctx.fillStyle ='blue';
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
    colourResults();
    drawCoordinateAxes();
    drawThresholds();
    drawPoints();
}
