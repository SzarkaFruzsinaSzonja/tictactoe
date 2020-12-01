'use strict';

const calcs = {
    '+': function (a, b) { return a + b },
    '-': function (a, b) { return a - b },
    '/': function (a, b) { return a / b },
    '*': function (a, b) { return a * b },
}

const signs = ['+'];

for (let i = 0; i < signs.length; i += 1) {
    console.log(calcs[signs[i]](10, 20));
}

document.querySelector('.number7').addEventListener('click', () => {
    console.log(event);
})