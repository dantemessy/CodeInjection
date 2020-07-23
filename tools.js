'use strict';
const esp = require('esprima');
const esg = require('escodegen');

var alphaNum = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

function generateRandomId(len) {
	// var length = len || 10;
	// var id = '';
	// for (var i = length; i--; ) {
	// 	id += alphaNum[~~(Math.random() * alphaNum.length)];
	// }
    // return id;
    
    return '_' + Math.random().toString(36).substr(2, 3)
}


function processAst(ast) {
    // If this isn't actual body, recurse with the body
    if (!Array.isArray(ast)) {
      processAst(ast.body);
      return;
    }
    // Traverse the body
    for (var i = ast.length; i--; ) {
      var currentElement = ast[i];
  
      // Process `currentElement` here
      if (
        (currentElement && currentElement.type === "ForStatement") ||
        currentElement.type === "WhileStatement" ||
        currentElement.type === "DoWhileStatement"
      ) {
        // We got a loop!
        // console.log(currentElement);
        var ast1 = esp.parseScript("let myvar = Date.now();");
        var ast2 = esp.parseScript(
          "while(a){if (Date.now() - myvar > 1000) { break;}}"
        );
        var insertionBlocks = {
          before: ast1.body[0],
          inside: ast2.body[0].body.body[0]
        };
        let randomVariableName = generateRandomId();
        insertionBlocks.before.declarations[0].id.name = insertionBlocks.inside.test.left.right.name = randomVariableName;
      
        // Insert time variable assignment as first child in the body array.
        ast.splice(i, 0, insertionBlocks.before);
      
        // If the loop's body is a single statement, then convert it into a block statement
        // so that we can insert our conditional break inside it.
        if (!Array.isArray(currentElement.body)) {
          currentElement.body = {
            body: [currentElement.body],
            type: "BlockStatement"
          };
        }
      
        // Insert the `If` Statement check
        currentElement.body.body.unshift(insertionBlocks.inside);


      }
  
      // Recurse on inner body
      if (currentElement.body) {
        processAst(currentElement.body);
      }
    }
  };



 module.exports=  function instrumentCode(code) {
    var ast = esp.parseScript(code);
    console.log('parsed code',ast);
    processAst(ast);
    ast = esg.generate(ast);
    return ast;
  };


