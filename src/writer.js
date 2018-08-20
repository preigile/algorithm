const fs = require('fs');

class Writer {
    constructor(data) {
        this.data = data;
    }

    write(file) {
        const string = JSON.stringify(this.data, null, 2);

        fs.writeFile(file, string, function (err) {
            if (err) throw err;
        });
    }
}

module.exports = Writer;
