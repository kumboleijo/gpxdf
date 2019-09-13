const program = require('commander');
const pjson = require('../package.json');

const gpxdf = require('./main');

function cli(argv) {
    program
        .version(pjson.version)
        .description(pjson.description)
        .option('-i ,--input <file>', 'specify the input file')
        .option('-o, --output <file>', 'specifiy the output file', 'reduced.gpx');

    program.parse(argv);

    gpxdf(program.input, program.output);
}

module.exports = cli;
