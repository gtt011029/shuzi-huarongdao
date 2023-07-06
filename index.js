/*
首先要捋清思路：
1、生成一个棋盘格
2、塞入对应的数字
3、触发点击事件，点击的时候要判断当前数字是否可以移动， 周围如果都有数字的情况下不可以移动， 周围有empty的情况下才可以移动
4、不可以移动的情况下，基于警告
5、可以移动的情况下，让其和empty对换
6、每次都要检查是否成功， 如果成功的话报喜
* */

var type = 3; // 棋盘格维数

function changeType() {
    console.log(document.getElementById('select').selectedIndex);
    type = document.getElementById('select').selectedIndex + 2;
    document.getElementById('myTable').remove();
    
    createTable();
    random();
}


function clickHandler(e) {
    if (e.target.innerHTML === '') {
        return;
    }
    if (checkCanMove(e.target.id.split('cell-')[1])) {
        moveBox(e);
    } else {
        // 加个动画，表示移动不了
        e.target.animate({ backgroundColor: 'red' }, 400);
    }
    checkSuccess();
}

// 检查是否可以移动
function checkCanMove(idIndex) {
    let flag = false; // 默认不可以移动
    // 获取当前index对应的二维下标
    const indexArr = [parseInt(idIndex / type), idIndex % type];
    // 找到周围的格子里对应的二维下标
    const brother = [
        [indexArr[0], indexArr[1] + 1],
        [indexArr[0], indexArr[1] - 1],
        [indexArr[0] + 1, indexArr[1]],
        [indexArr[0] - 1, indexArr[1]]
    ];
    for (let i = 0; i < brother.length; i++) {
        // 找到有效的邻居
        if (brother[i][0] >= 0 && brother[i][0] < type && brother[i][1] >= 0 && brother[i][1] < type) {
            // 找到其对应的cell
            const id = brother[i][0] * type + brother[i][1];
            const cell = document.getElementById(`cell-${id}`);
            if (cell && cell.innerHTML === '') {
                flag = true;
                break;
            }
        } else {
            continue;
        }
    }
    return flag;
}

// 移动元素
function moveBox(e) {
    const oldEmpty = document.getElementsByClassName('empty')[0];
    oldEmpty.innerHTML = e.target.innerHTML;
    oldEmpty.className = 'cell';
    e.target.innerHTML = '';
    e.target.className = 'empty';
}

function checkSuccess() {
    let flag = true;
    document.querySelectorAll('.cell').forEach(cell => {
        const id = cell.id.split('cell-')[1];
        if (cell.innerHTML && (parseInt(id) + 1) !== parseInt(cell.innerHTML)) {
            flag = false;
        }
    });
    if (flag) {
        setTimeout(() => {
            const confirmFlag = confirm('恭喜你通关了， 是否再来一局');
            if (confirmFlag) {
                //打乱顺序
                random();
            }
        });
    }
    console.log(flag);
}

// 创建棋盘格
function createTable() {
    const myTable = document.createElement('table');
    myTable.id = 'myTable';
    myTable.className = 'tableBox';
    document.body.appendChild(myTable);
    
    let counter = 0; // td 的数量
    for (let i = 0; i < type; i++) {
        const row = document.createElement('tr');
        for (let j = 0; j < type; j++) {
            const cell = document.createElement('td');
            cell.id = `cell-${counter}`;
            cell.addEventListener('click', clickHandler);
            row.appendChild(cell);
            counter++;
        }
        myTable.appendChild(row);
    }
}

// 随机生成数据
function random() {
    let numArray = Array.from({ length: type * type }, (_, index) => index + 1);
    const numbers = [];
    while (numArray.length) {
        // 随机取一下下标
        const index = parseInt(Math.random() * numArray.length);
        // 把下标对应的数据push进新的数组
        numbers.push(numArray[index]);
        // 把下标对应的数从旧数组删除, splice 会改变原数组
        numArray.splice(index, 1);
    }
    
    // 把随机生成的数字塞入到cell中
    for (let i = 0; i < numbers.length; i++) {
        const cell = document.getElementById(`cell-${i}`);
        if (numbers[i] === numbers.length) {
            cell.innerHTML = '';
            cell.className = 'empty';
        } else {
            cell.innerHTML = numbers[i];
            cell.className = 'cell';
        }
    }
    
    return numbers;
}

createTable();
random();
