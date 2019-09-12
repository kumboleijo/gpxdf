const fs = require('fs')
const path = require('path')
const util = require('util')
const readFile = util.promisify(fs.readFile)
const writeFile = util.promisify(fs.writeFile)

const xml2js = require('xml2js')

const parser = new xml2js.Parser()
const parseString = util.promisify(parser.parseString)
const builder = new xml2js.Builder()

const cwd = process.cwd()

async function gpxdf(options) {
    let _path = path.isAbsolute(options) ? options : `${cwd}/${options}`
    let gpxFile = await readFile(_path)
    let parsedFile = await parseString(gpxFile)
    let trkpts = parsedFile.gpx.trk[0].trkseg[0].trkpt
    let trkptsLength = trkpts.length
    var uniqueTrkpts = getUnique(trkpts, 'time')
    var uniqueTrkptsLength = uniqueTrkpts.length
    var duplicatesCounter = trkptsLength - uniqueTrkptsLength
    var reducedFile = parsedFile
    reducedFile.gpx.trk[0].trkseg[0].trkpt = uniqueTrkpts
    var xml = builder.buildObject(reducedFile)
    let reducedFileName = `${_path}.reduced.gpx`
    await writeFile(reducedFileName, xml)
    
    return { duplicatesCounter, reducedFileName }
}

function getUnique(arr, comp) {
    const unique = arr.map(e => e[comp][0])
        // store the keys of the unique objects
        .map((e, i, final) => final.indexOf(e) === i && i)
        // eliminate the dead keys & store unique objects
        .filter(e => arr[e]).map(e => arr[e]);
    return unique;
}

module.exports = gpxdf