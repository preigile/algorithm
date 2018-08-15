let fs = require('fs');

fs.readFile('data/input.json', function (err, data) {
    let input = JSON.parse(data);
    console.log(input);

    let ouputString = JSON.stringify(input);
    fs.writeFile('data/output_new.json', ouputString, function (err) {
        if (err) throw err;
        console.log('Saved!');
    });
});
