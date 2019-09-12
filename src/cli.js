// usage represents the help guide
const usage = function () {
    var usageText = `
    This tool helps you to find and remove duplicates from a gpx file.
  
    usage:  gpxdf <file.gpx>

    <file.gpx>    relative path to the .gpx file
  `
    console.log(usageText)
}

const gpxdf = require('./main')

function cli(args) {
  let options = args.splice(2)
  if (options.length != 1) usage() && process.exit(1)
  else gpxdf(options[0])
}

module.exports = cli
