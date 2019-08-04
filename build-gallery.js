const extractFrames = require('ffmpeg-extract-frames');
const fs = require('fs');
const path = require('path');
const os = require('os');
const getDimensions = require('get-video-dimensions');

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

async function generateThumbs() {
    let gpath = path.join(os.homedir(), 'pfgallery', 'half');
    let thumbsp = path.join(os.homedir(),'pfgallery','thumbs');
    //everything not a directory in that dir buddy you best remember that
    //theres a DS_Store file in every macOS directory so filter that out
    let vNames = fs.readdirSync(gpath)
        .filter(file => fs.lstatSync(path.join(gpath, file)).isFile() && file !== '.DS_Store');
    let vPaths = vNames.map( (name) => path.join(gpath, name) );
    
    //generate thumbs from video must have ffMPEG installed, 5s in or first frame
    vPaths.forEach ( async (vPath) => await extractFrames({
       input: vPath,
       output: path.join(thumbsp, path.parse(vPath).name + '.png') ,
        offsets: [3000]
    }));
    let vInfo = []
    await vNames.forEach( async (vname) => {
        await getDimensions(path.join(gpath,vname)).then(  (dimensions) => {
            let asp;
            if(dimensions.width === dimensions.height){
                asp = 'square';
            }else {
                asp = 'rect';
            }
            vInfo.push({name: vname, size: dimensions, aspect: asp}); console.log(vInfo);} )} );
    setTimeout(() => {
        let sqs = vInfo.filter( (obj) => obj.aspect === 'square' );
        let rcts = vInfo.filter( (obj) => obj.aspect === 'rect' );
        shuffleArray(sqs);
        shuffleArray(rcts);
        let sortedVInfo = [];
        console.log(sqs);
        console.log(rcts);
        if(rcts[0]) sortedVInfo.push(rcts.pop());
        while(sqs.length > 0 || rcts.length > 0){
            console.log(sqs.length);
            console.log(rcts.length);
            if(sqs[0]) sortedVInfo.push(sqs.pop());
            if(sqs[0]) sortedVInfo.push(sqs.pop());
            if(sqs[0] && sortedVInfo.length % 2 == 0) sortedVInfo.push(sqs.pop());
            if(rcts[0]) sortedVInfo.push(rcts.pop());
        }
        console.log(sortedVInfo);
        sortedVInfo.pop();

        fs.writeFile('./src/videos.json', JSON.stringify(sortedVInfo,null,2), 'utf8', (err) => {if (err) throw err})

        }, 12000);
    //write vNames to static json so webpack knows which files to grab from public/
}



generateThumbs();
