const program = require('commander');
const pjson = require('../package.json');

const gpxdf = require('./main');

function cli(argv) {
    program
        .version(pjson.version)
        .description(pjson.description)
        .option('-i ,--input <file>', 'specify the input file')
        .option('-o, --output <file>', 'specifiy the output file', 'reduced.gpx')
        .option('-c, --count', 'show count stats', false);

    program.parse(argv);

    gpxdf(program.input, program.output, program.count);
}

module.exports = cli;
