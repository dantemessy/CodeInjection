'use strict';

const instrumentCode = require('./tools.js');
// let code = `console.log('ola')`

let code = `
    while(true){
    }
`


let esCode = instrumentCode(code);

console.log('index',esCode);
