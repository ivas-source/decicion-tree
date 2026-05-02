import { buildTree, predict } from './tree.js'

const SCALE = 8;
const DATA_MAX = 50;

const startingButton = document.getElementById('start-button');
const drawingButton = document.getElementById('draw-button');
const canvas = document.getElementById('canva');
const ctx = canvas.getContext('2d');
const w = canvas.width;
const h = canvas.height;

let dataset = [];
let tree = null;
let thresholds = [];

function generateDataset() {
    dataset = [];
    for (let i = 0; i < 20; i++) {
        dataset.push({ x: Math.random() * DATA_MAX, y: Math.random() * DATA_MAX, label: Math.floor(Math.random() * 2) });
    }
    tree = buildTree(dataset, 'label');
    thresholds = [];
    collectThresholds(tree);
    ctx.clearRect(0, 0, w, h);
}

function collectThresholds(node, xMin = 0, xMax = DATA_MAX, yMin = 0, yMax = DATA_MAX) {
    if (typeof node !== 'object' || node === null) return;
    thresholds.push({ feature: node.feature, threshold: node.threshold, xMin, xMax, yMin, yMax });
    if (node.feature === 'x') {
        collectThresholds(node.left, xMin, node.threshold, yMin, yMax);
        collectThresholds(node.right, node.threshold, xMax, yMin, yMax);
    } else if (node.feature === 'y') {
        collectThresholds(node.left, xMin, xMax, yMin, node.threshold);
        collectThresholds(node.right, xMin, xMax, node.threshold, yMax);
    }
}

function drawCoordinateAxes() {
    const arrow = 8;
    const spread = Math.PI / 7;

    ctx.strokeStyle = '#1a1a1a';
    ctx.fillStyle = '#1a1a1a';
    ctx.font = 'italic 13px system-ui, sans-serif';

    ctx.beginPath();
    ctx.moveTo(0, h);
    ctx.lineTo(w, h);
    ctx.stroke();


    ctx.beginPath();
    ctx.moveTo(w, h);
    ctx.lineTo(w - arrow * Math.cos(spread), h - arrow * Math.sin(spread));
    ctx.moveTo(w, h);
    ctx.lineTo(w - arrow * Math.cos(spread), h + arrow * Math.sin(spread));
    ctx.stroke();

    ctx.fillText('x', w - 16, h - 8);

    
    ctx.beginPath();
    ctx.moveTo(0, h);
    ctx.lineTo(0, 0);
    ctx.stroke();


    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo( arrow * Math.sin(spread), arrow * Math.cos(spread));
    ctx.moveTo(0, 0);
    ctx.lineTo(-arrow * Math.sin(spread), arrow * Math.cos(spread));
    ctx.stroke();

    ctx.fillText('y', 6, 14);
}

function drawThresholds() {
    ctx.strokeStyle = '#374151';
    for (const point of thresholds) {
        ctx.beginPath();
        if (point.feature === 'x') {
            const canvasX = point.threshold * SCALE;
            ctx.moveTo(canvasX, (DATA_MAX - point.yMin) * SCALE);
            ctx.lineTo(canvasX, (DATA_MAX - point.yMax) * SCALE);
        } else if (point.feature === 'y') {
            const canvasY = (DATA_MAX - point.threshold) * SCALE;
            ctx.moveTo(point.xMin * SCALE, canvasY);
            ctx.lineTo(point.xMax * SCALE, canvasY);
        }
        ctx.stroke();
    }
}

function drawPoints() {
    for (const point of dataset) {
        ctx.beginPath();
        ctx.arc(point.x * SCALE, (DATA_MAX - point.y) * SCALE, 3, 0, Math.PI * 2);
        ctx.fillStyle = '#1a1a1a';
        ctx.fill();
    }
}

function colourResults() {
    for (let i = 0; i < w; i++) {
        for (let j = 0; j < h; j++) {
            const point = { x: i / SCALE, y: DATA_MAX - j / SCALE };
            ctx.fillStyle = predict(tree, point) == 0 ? '#bfdbfe' : '#fde68a';
            ctx.fillRect(i, j, 1, 1);
        }
    }
}

startingButton.onclick = () => {
    generateDataset();
};

drawingButton.onclick = () => {
    colourResults();
    drawCoordinateAxes();
    drawThresholds();
    drawPoints();
};

generateDataset();
