// dataset - набор данных
// feature - свойство по которому делим на два массив
// threshold - условие свойства: например для свойства: weather мы делим наши данные по значениям 1 и 0
const dataset = [
    { age: 22, income: 15000, has_car: 0, credit_score: 580, label: 0 },
    { age: 45, income: 80000, has_car: 1, credit_score: 750, label: 1 },
    { age: 33, income: 42000, has_car: 0, credit_score: 670, label: 1 },
    { age: 19, income: 8000,  has_car: 0, credit_score: 520, label: 0 },
    { age: 55, income: 95000, has_car: 1, credit_score: 800, label: 1 },
    { age: 28, income: 31000, has_car: 1, credit_score: 640, label: 0 },
    { age: 17, income: 5000,  has_car: 0, credit_score: 500, label: 0 },
    { age: 61, income: 72000, has_car: 1, credit_score: 720, label: 1 },
    { age: 24, income: 18000, has_car: 0, credit_score: 590, label: 0 },
    { age: 39, income: 55000, has_car: 1, credit_score: 700, label: 1 },
    { age: 31, income: 28000, has_car: 0, credit_score: 610, label: 1 },
    { age: 47, income: 61000, has_car: 0, credit_score: 730, label: 1 },
    { age: 20, income: 11000, has_car: 0, credit_score: 540, label: 0 },
    { age: 52, income: 88000, has_car: 1, credit_score: 780, label: 1 },
    { age: 35, income: 47000, has_car: 1, credit_score: 660, label: 0 },
    { age: 23, income: 13000, has_car: 0, credit_score: 560, label: 0 },
    { age: 41, income: 66000, has_car: 0, credit_score: 710, label: 1 },
    { age: 29, income: 25000, has_car: 0, credit_score: 600, label: 1 },
    { age: 58, income: 91000, has_car: 1, credit_score: 790, label: 1 },
    { age: 26, income: 22000, has_car: 1, credit_score: 570, label: 0 },
    { age: 44, income: 53000, has_car: 0, credit_score: 690, label: 1 },
    { age: 37, income: 39000, has_car: 1, credit_score: 630, label: 0 },
    { age: 50, income: 74000, has_car: 1, credit_score: 760, label: 1 },
    { age: 21, income: 9000,  has_car: 0, credit_score: 510, label: 0 },
    { age: 34, income: 44000, has_car: 0, credit_score: 650, label: 0 },
]


// Разделям наши данные на две ветви по некоторым условиям threshold (как мы будем получать это условие можно будет дальше увидеть)
function split(dataset, feature, threshold) {
    let left = [];
    let right = [];
    for (const point of dataset) {
        if (point[feature] > threshold){
            left.push(point)
        }
        else if (point[feature] < threshold){
            right.push(point)
        }
    }
    return {left, right}
}


// Считаем коэффицент Джини

function gini(points, feature) {
    // Получаем некоторый массив со всеми значениями некоторых свойств
    let values = []
    const count = {}
    for (const point of points){
        let a = point[feature]
        values.push(a)
    }
    let unique = new Set(values) // С помощью класса сет получаем объект хранящий уникальные значения массива values
    // Этим циклом считаем количество в массиве values этих уникальных значений, например если массив будет [1, 0, 0, 0, 1] то мы получим count = {1 : 2, 0: 3}
    for (const i of unique){
        count[i] = 0
        for (const j of values){
            if (i == j){
                count[i] += 1
            }
        }
        }
    // Находим сумму, которая используется в коэффиценте Джини: 1 - sum(веротностей)
    let sum = 0
    for (const k of unique){
        let p = count[k] / values.length
        sum += p**2
    }
    return 1 - sum
}

function findBestSplit(dataset, labelFeature){
    // Вводим это чтобы потом обновлять их значения
    let bestGini = 1;
    let bestFeature = null;
    let bestThreshold = null;


    let features = Object.keys(dataset[0]).slice(0, -1) // dataset[0] - это первый элемент массива, в нашем массиве это будет weather: 1, temp: 22, label: 1; я благодаря Object.keys мы получаем массив уникальных свойств
    // features - это массив всех свойств нашего датасета, помимо последнего, тк подразумевается, что наши датасеты всегда имеют 'label', как последний столбец (тут наверно надо придумать что-то другое)
    for (const feature of features){
        let values = []; 
        for (const i of dataset){
            let a = i[feature];
            values.push(a);
        }
        const unique = [... new Set(values)].sort((a, b) => a - b);
        /*
        Вообщем, опять получаем все уникальные значения values; сортируем массив, нужно это для чего: так как нам нужно лучшее разделение, мы должны впринципе проверить все возможные разделения
        посчитать для них коэффицент Джини и выбрать с наименьшим коэффицентом, если у нас данные типа [9, 12, 15, 17], то в какой-то книжке я вычитал, что обычно проверяют по средним арифметическим
        идущим друг за другом элементам, то есть a = (9 + 12) / 2, делят на две части, где значения меньше a и больше a; считаем для каждого коэффицент Джини, после этого считаем взвешеннный коэффицент
        Джини т.к. количество значений может отличаться, поэтому я сортирую массив по возрастанию, чтобы удобнее считать средние арифметические.
        */ 
        let temps = [];
        for (let i = 0; i < unique.length - 1; i++ ){
            let temp = (unique[i] + unique[i+1]) / 2;
            temps.push(temp);
        }
        // Посчитали все возможные средние арифметические, теперь итерируемся по ним, делим и считаем коэффицент Джини, перезаписывая bestGini, bestFeature, bestThreshold
        for (const threshold of temps){
            const result = split(dataset, feature, threshold)
            let gLeft = gini(result.left, labelFeature)
            let gRight = gini(result.right, labelFeature)
            let g = (result.left.length / (result.left.length + result.right.length)) *gLeft + (result.right.length / (result.left.length + result.right.length)) * gRight
            if (g < bestGini){
                bestGini = g;
                bestFeature = feature;
                bestThreshold = threshold;
            }
        }
        
    }
    return {bestFeature, bestThreshold}
}

/* Сделал это отдельной функцией, потому что в построении дерева в листьях нам нужно возвращать именно Мажоритарный класс: по каким-то причинам дерево может остановиться и у нас в листе будет
не полное разбиение: к примеру у нас уже глубина 5: и дерево останавливается и значения в этом листе [1, 0, 1, 1], и в таком случае дерево предсказывает мажоритарный класс, то есть класс, значений
которого просто больше (тут логично что 3/4 вероятность что 1, поэтому предскажет 1)
*/
function findMajorClass(dataset, labelFeature) {
    let bestClass = null;
    let bestCount = 0;
    let count = {};
    let values = [];
    for (const i of dataset){
        let a = i[labelFeature]
        values.push(a)
    }
    let unique = [...new Set(values)]
    for (const j of unique){
        count[j] = 0
        for (const k of values){
            if (j == k){
                count[j] += 1
            }
        }
        }
    for (const key of Object.keys(count)){
        console.log(key)
        if (count[key] > bestCount){
            bestClass = key;
            bestCount = count[key]
        }
    }
    return bestClass
}
// Рекурсивная функция, база рекурсии это полное разделение классов unique.length === 1; глубина >= 5; и количество объектов <= 3
function buildTree(dataset, labelFeature, depth = 0){
    let values = [];
    for (const i of dataset){
        let value = i[labelFeature]
        values.push(value)
    }
    let unique = [...new Set(values)]
    if (unique.length === 1){
        return unique[0]
    }
    if (depth >= 5){
        return findMajorClass(dataset, labelFeature)
    }
    if (dataset.length <= 3){
        return findMajorClass(dataset, labelFeature)
    }
    let a = findBestSplit(dataset, labelFeature)
    let b = split(dataset, a.bestFeature, a.bestThreshold)
    let left = buildTree(b.left, labelFeature, depth + 1)
    let right = buildTree(b.right, labelFeature, depth + 1)
    return {
        feature: a.bestFeature,
        threshold: a.bestThreshold,
        left: left,
        right: right
    }
 }

console.log(buildTree(dataset, 'label'))


