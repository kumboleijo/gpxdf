const fs = require('fs');
const path = require('path');
const util = require('util');
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

const xml2js = require('xml2js');
const xa = require('xa');

const parser = new xml2js.Parser();
const parseString = util.promisify(parser.parseString);
const builder = new xml2js.Builder();

const cwd = process.cwd();

async function gpxdf(input, output) {
    xa.info('input:  ' + input);
    let _inputPath = path.isAbsolute(input) ? input : `${cwd}/${input}`;
    let _outputPath = path.isAbsolute(output) ? output : `${cwd}/${output}`;
    let gpxFile = await readFile(_inputPath);
    let parsedFile = await parseString(gpxFile);
    xa.success('parse input file');

    let trkpts = parsedFile.gpx.trk[0].trkseg[0].trkpt;
    let trkptsLength = trkpts.length;
    let uniqueTrkpts = getUnique(trkpts, 'time');
    let uniqueTrkptsLength = uniqueTrkpts.length;
    let duplicatesCounter = trkptsLength - uniqueTrkptsLength;
    let duplicatesCounterString = `there are ${duplicatesCounter} duplicates`;
    if (duplicatesCounter == 0) {
        xa.info('there are no duplicates');
        process.exit(1);
    }
    xa.info(duplicatesCounterString);

    let reducedFile = parsedFile;
    reducedFile.gpx.trk[0].trkseg[0].trkpt = uniqueTrkpts;
    let xml = builder.buildObject(reducedFile);

    xa.info('output:  ' + output);
    await writeFile(_outputPath, xml);
    xa.success('file saved');
}

function getUnique(arr, comp) {
    const unique = arr
        .map(e => e[comp][0])
        // store the keys of the unique objects
        .map((e, i, final) => final.indexOf(e) === i && i)
        // eliminate the dead keys & store unique objects
        .filter(e => arr[e])
        .map(e => arr[e]);
    return unique;
}

module.exports = gpxdf;
