const extractFrames = require('ffmpeg-extract-frames');
const fs = require('fs');
const path = require('path');
const getDimensions = require('get-video-dimensions');


async function generateThumbs() {

    //everything not a directory in that dir buddy you best remember that
    //theres a DS_Store file in every macOS directory so filter that out
    let vNames = fs.readdirSync('./public/gallery')
        .filter(file => fs.lstatSync(path.join(__dirname,'public', 'gallery', file)).isFile() && file !== '.DS_Store');

    let vPaths = vNames.map( (name) => path.join(__dirname,'public', 'gallery', name) );
    
    //generate thumbs from video must have ffMPEG installed, 5s in or first frame
    vPaths.forEach ( async (vPath) => await extractFrames({
       input: vPath,
       output: path.join(__dirname,'public','gallery', 'thumbs', path.parse(vPath).name + '.png') ,
        offsets: [1000]
    }));
    let vInfo = []
    await vNames.forEach( async (vname) => {
        getDimensions(`./public/gallery/${vname}`).then( (dimensions) => vInfo.push({name: vname, size: dimensions}))} );
    setTimeout(() => fs.writeFile('./src/videos.json', JSON.stringify(vInfo), 'utf8', (err) => {if (err) throw err}), 5000);
    //write vNames to static json so webpack knows which files to grab from public/
}



generateThumbs();
