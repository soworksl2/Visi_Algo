//Credits pop sound: Sound Effect from Pixabay

let CANVAS_RESOLUTION_FACTOR = 200;
let ITERATION_TIME = 5;
let AUDIO_POP = new Audio('pop.mp3');


var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');


let DATA = [15, 29, 98, 91, 50, 37, 96, 11, 63, 5, 62, 64, 6, 25, 72, 99, 95, 27, 82, 77, 12, 26, 46, 84, 88, 9, 1, 10, 2, 24, 31, 34, 33, 60, 75, 79, 74, 43, 53, 35, 65, 97, 78, 85, 54, 22, 7, 30, 89, 40, 42, 61, 13, 90, 14, 56, 58, 94, 41, 49, 76, 23, 4, 36, 47, 68, 100, 20, 55, 18, 69, 44, 39, 66, 19, 8, 16, 80, 21, 83, 93, 71, 38, 32, 86, 57, 92, 73, 70, 45, 59, 28, 48, 52, 67, 51, 3, 87, 81, 17 ];


function convert_data_to_height(min_data, max_data, data){
    let point1 = [min_data, 0];
    let point2 = [max_data, canvas.height];
    let m = (point2[1] - point1[1])/(point2[0] - point1[0]);
    return m * (data - point1[0]);
}

function draw_box(height, width, index, color){
    let x = index * width;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.rect(x, canvas.height, width, -height);
    ctx.fill();
}

function render(data, red_arr){
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let box_width = canvas.width / data.length;

    let min_data = Math.min( ...data);
    let max_data = Math.max( ...data);
    for (let i = 0; i < data.length; i++){
        cheight = convert_data_to_height(min_data, max_data, data[i]);
        let color = 'white';
        if (red_arr.includes(i)){
            color = 'red';
        }
        draw_box(cheight, box_width, i, color);
    }
}

function initiate(){
    canvas.width = CANVAS_RESOLUTION_FACTOR * 16;
    canvas.height = CANVAS_RESOLUTION_FACTOR * 9;
}

async function sleep(time){
    await new Promise(r => setTimeout(r, time));
}

function swap(data, i1, i2){
    let temp = data[i1];
    data[i1] = data[i2];
    data[i2] = temp;
    AUDIO_POP.play();
}

async function bubble_sort(data){
    initiate();

    let i1 = 0;
    let i2 = 1;

    if (data.length <= 1){
        render(DATA);
        return;
    } else if (data.length == 2){
        render(DATA, [i1, i2]);
        await sleep(ITERATION_TIME);
        if (data[i1] > data[i2]) {
            swap(DATA, i1, i2);
        }
        render(DATA , []);
        return
    }

    let end = data.length;
    render(DATA, [i1, i2]);
    await sleep(ITERATION_TIME);
    while (end > 2){
        while (i2 <= end){
            if (DATA[i1] > DATA[i2]) {
                swap(DATA, i1, i2);
            }
            render(DATA, [i1, i2]);
            await sleep(ITERATION_TIME);
            i1++;
            i2++;
        }
        end--;
        i1=0;
        i2=1;
    }
}

bubble_sort(DATA);
