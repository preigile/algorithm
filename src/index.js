const fs = require('fs');

const Writer = require('./writer');
const Reader = require('./reader');
const Calculator = require('./calculator');

const args = process.argv.slice(2);

if (args.length < 1) {
    console.log('Please provide input file name.');
    return;
}

const inputFile = args[0];
const outputFile = args.length >= 2 ? args[1] : 'output-result.json';

const data = Reader.read(inputFile);

console.time("Calculate");

const calculator = new Calculator(data.powerplan, data.devices);
const result = calculator.calculate();
console.timeEnd("Calculate");

console.log('Result file:', outputFile);
new Writer(result).write(outputFile);
