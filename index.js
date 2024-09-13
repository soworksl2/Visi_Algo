//Credits pop sound: Sound Effect from Pixabay

let CANVAS_RESOLUTION_FACTOR = 200;
let ITERATION_TIME = 5;
let AUDIO_POP = new Audio('pop.mp3');


let DATA = [];

let algo_iter = undefined;
let is_playing = false;


// USER INTERFACE
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

let btn_introduce = document.getElementById('btn-introduce');
let btn_random = document.getElementById('btn-random');

let btn_play = document.getElementById('btn-play');
let btn_stop = document.getElementById('btn-stop');

let user_list = document.getElementById('user-list');


function list2str(l){
    str = ''
    for (let i=0; i < l.length; i++){
        if (i > 0){
            str += ', ';
        }
        str += l[i];
    }
    return str;
}

function str2list(){
    let l = [];

    let str_numbers = user_list.value.split(',');
    return str_numbers.map(function(e){
        return Number(e.trim());
    })
}

function shuffle(array) {
    let currentIndex = array.length;

        while (currentIndex != 0) {
            let randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;

            [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
        }
}

function generate_random_list(){
    let quantity = 0;
    try {
        quantity = Number(prompt('cantidad de numeros'));
    } catch (error) {
        alert('What are you doing broh? the data you give me are not correct!');
        return;
    }

    let numbers = [];
    for (let i = 0; i < quantity; i++){
        numbers.push(i);
    }

    shuffle(numbers);

    let str = list2str(numbers);
    user_list.value = str;
    introduce_data(numbers);
}

function introduce_data(data){
    DATA = data;
    render(DATA, []);
    algo_iter = undefined;
}

function introduce_data_user_list(){
    let n = str2list(user_list.value);
    introduce_data(n);
}


btn_introduce.addEventListener('click', introduce_data_user_list);
btn_random.addEventListener('click', generate_random_list);

btn_play.addEventListener('click', function () {play_algorithm(bubble_sort)});
btn_stop.addEventListener('click', stop_animation);

//-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*

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

function set_ui_disabled(v){
    user_list.disabled = v;
    btn_play.disabled = v;
    btn_introduce.disabled = v;
    btn_random.disabled = v;
}

async function play_algorithm(algo_func){
    is_playing = true;
    set_ui_disabled(true);
    let is_ended = false;
    let iter_algo = algo_iter;
    if (iter_algo === undefined){
        iter_algo = algo_func();
    }
    while (is_playing){
        is_ended = await iter_algo.next();
    }

    if (is_ended){
        animation_ctx = undefined;
    }
}

function stop_animation(algo_func){
    is_playing = false;
    set_ui_disabled(false);
}

async function sleep(time){
    await new Promise(r => setTimeout(r, time));
}

function swap(data, i1, i2){
    let temp = data[i1];
    data[i1] = data[i2];
    data[i2] = temp;
    //AUDIO_POP.play();
}

async function* bubble_sort(){
    let data = DATA

    let i1 = 0;
    let i2 = 1;
    let end = data.length;

    if (data.length <= 1){
        render(DATA);
        return yield true;
    } else if (data.length == 2){
        render(data, [i1, i2]);
        await sleep(ITERATION_TIME);
        if (data[i1] > data[i2]) {
            swap(data, i1, i2);
        }
        render(data , []);
        return yield true;
    }

    render(data, [i1, i2]);
    await sleep(ITERATION_TIME);
    while (end > 2){
        while (i2 <= end){
            if (data[i1] > data[i2]) {
                swap(data, i1, i2);
            }
            render(data, [i1, i2]);
            await sleep(ITERATION_TIME);
            i1++;
            i2++;
            yield false;
        }
        end--;
        i1=0;
        i2=1;
        yield false;
    }
    is_playing = false;
    return yield true;
}

initiate();
