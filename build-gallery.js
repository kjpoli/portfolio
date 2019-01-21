const extractFrames = require('ffmpeg-extract-frames');
const fs = require('fs');
const path = require('path');
const os = require('os');
const getDimensions = require('get-video-dimensions');


async function generateThumbs() {
    let gpath = path.join(os.homedir(), 'pfgallery');
    //everything not a directory in that dir buddy you best remember that
    //theres a DS_Store file in every macOS directory so filter that out
    let vNames = fs.readdirSync(gpath)
        .filter(file => fs.lstatSync(path.join(gpath, file)).isFile() && file !== '.DS_Store');

    let vPaths = vNames.map( (name) => path.join(gpath, name) );
    
    //generate thumbs from video must have ffMPEG installed, 5s in or first frame
    vPaths.forEach ( async (vPath) => await extractFrames({
       input: vPath,
       output: path.join(gpath,'thumbs', path.parse(vPath).name + '.png') ,
        offsets: [1000]
    }));
    let vInfo = []
    await vNames.forEach( async (vname) => {

        getDimensions(`../pfgallery/${vname}`).then( (dimensions) => {
            let asp;
            if(dimensions.width === dimensions.height){
                asp = 'square';
            }else {
                asp = 'rect';
            }
            vInfo.push({name: vname, size: dimensions, aspect: asp})} )} );
    setTimeout(() => fs.writeFile('./src/videos.json', JSON.stringify(vInfo), 'utf8', (err) => {if (err) throw err}), 5000);
    //write vNames to static json so webpack knows which files to grab from public/
}



generateThumbs();
