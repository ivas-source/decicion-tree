import { buildTree, predict, gini, split } from './tree.js'

const SCALE = 8;
const DATA_MAX = 50;

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
    drawTreeVisualization();
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

drawingButton.onclick = () => {
    generateDataset();
    colourResults();
    drawCoordinateAxes();
    drawThresholds();
    drawPoints();
};

// ── Tree visualization ──────────────────────────────────────────────────────

const treeCanvas = document.getElementById('tree-canvas');
const tCtx = treeCanvas.getContext('2d');

const NODE_W = 134;
const NODE_H = 74;
const LEVEL_H = 118;
const TREE_PAD = 28;

let treeNodes = [];
let treeEdges = [];

function countLeaves(node) {
    if (typeof node !== 'object' || node === null) return 1;
    return countLeaves(node.left) + countLeaves(node.right);
}

function treeMaxDepth(node) {
    if (typeof node !== 'object' || node === null) return 0;
    return 1 + Math.max(treeMaxDepth(node.left), treeMaxDepth(node.right));
}

function majorClass(nodeDataset) {
    const count = {};
    for (const p of nodeDataset) count[p.label] = (count[p.label] || 0) + 1;
    return Object.entries(count).sort((a, b) => b[1] - a[1])[0]?.[0] ?? '?';
}

function roundRect(c, x, y, w, h, r) {
    c.beginPath();
    c.moveTo(x + r, y);
    c.lineTo(x + w - r, y);
    c.arcTo(x + w, y, x + w, y + r, r);
    c.lineTo(x + w, y + h - r);
    c.arcTo(x + w, y + h, x + w - r, y + h, r);
    c.lineTo(x + r, y + h);
    c.arcTo(x, y + h, x, y + h - r, r);
    c.lineTo(x, y + r);
    c.arcTo(x, y, x + r, y, r);
    c.closePath();
}

function collectNodes(node, nodeDataset, xMin, xMax, nodeY, parentCX, parentBottomY) {
    const cx = (xMin + xMax) / 2;
    const isLeaf = typeof node !== 'object' || node === null;
    const nodeGini = nodeDataset.length > 0 ? gini(nodeDataset, 'label') : 0;
    const label = isLeaf ? node : majorClass(nodeDataset);

    treeNodes.push({
        x: cx - NODE_W / 2,
        y: nodeY,
        cx,
        isLeaf,
        condition: isLeaf ? null : `${node.feature} ≤ ${node.threshold.toFixed(2)}`,
        giniVal: nodeGini,
        samples: nodeDataset.length,
        label,
    });

    if (parentCX !== null) {
        treeEdges.push({ x1: parentCX, y1: parentBottomY, x2: cx, y2: nodeY });
    }

    if (!isLeaf) {
        const branches = split(nodeDataset, node.feature, node.threshold);
        const leftLeaves  = countLeaves(node.left);
        const rightLeaves = countLeaves(node.right);
        const mid = xMin + (leftLeaves / (leftLeaves + rightLeaves)) * (xMax - xMin);
        collectNodes(node.left,  branches.left,  xMin, mid,  nodeY + LEVEL_H, cx, nodeY + NODE_H);
        collectNodes(node.right, branches.right, mid,  xMax, nodeY + LEVEL_H, cx, nodeY + NODE_H);
    }
}

function drawTreeVisualization() {
    treeNodes = [];
    treeEdges = [];

    const leaves = countLeaves(tree);
    const depth  = treeMaxDepth(tree);

    treeCanvas.width  = Math.max(leaves * (NODE_W + 18), NODE_W + TREE_PAD * 2);
    treeCanvas.height = (depth + 1) * LEVEL_H + TREE_PAD;

    tCtx.clearRect(0, 0, treeCanvas.width, treeCanvas.height);

    collectNodes(tree, dataset, TREE_PAD, treeCanvas.width - TREE_PAD, TREE_PAD, null, null);

    // Edges
    tCtx.strokeStyle = '#9ca3af';
    tCtx.lineWidth = 1.5;
    for (const e of treeEdges) {
        tCtx.beginPath();
        tCtx.moveTo(e.x1, e.y1);
        tCtx.lineTo(e.x2, e.y2);
        tCtx.stroke();
    }

    // Nodes
    tCtx.textAlign = 'center';
    for (const n of treeNodes) {
        tCtx.fillStyle   = n.label == 0 ? '#bfdbfe' : '#fde68a';
        tCtx.strokeStyle = n.label == 0 ? '#93c5fd' : '#fcd34d';
        tCtx.lineWidth = 1.5;
        roundRect(tCtx, n.x, n.y, NODE_W, NODE_H, 7);
        tCtx.fill();
        tCtx.stroke();

        tCtx.fillStyle = '#1a1a1a';
        const lines = n.isLeaf
            ? [`Класс: ${n.label}`, `Джини: ${n.giniVal.toFixed(3)}`, `Сэмплов: ${n.samples}`]
            : [n.condition, `Джини: ${n.giniVal.toFixed(3)}`, `Сэмплов: ${n.samples}`, `Класс: ${n.label}`];

        const lineH  = 15;
        const startY = n.y + (NODE_H - lines.length * lineH) / 2 + 12;

        tCtx.font = 'bold 10.5px system-ui, sans-serif';
        tCtx.fillText(lines[0], n.cx, startY);
        tCtx.font = '10.5px system-ui, sans-serif';
        for (let i = 1; i < lines.length; i++) {
            tCtx.fillText(lines[i], n.cx, startY + i * lineH);
        }
    }

    tCtx.textAlign = 'left';
    tCtx.lineWidth = 1;
}

generateDataset();
