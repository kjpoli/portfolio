import React, { Component } from 'react';
import { Player } from 'video-react';
import * as videos from './videos.json';
import Fade from 'react-reveal/Fade';
const pparse = require('path-parse');

class VideoGrid extends Component {
    constructor(props){
        super(props);
        this.state = {bitrate: 'half'};
    }
  render() {
    let vNames = videos.default;
    let sqs = vNames.filter( (obj) => obj.aspect === 'square' );
    let rcts = vNames.filter( (obj) => obj.aspect === 'rect' );

    return <Fade bottom cascade  >
             <h5>click or touch a video to play it </h5>
             <h5>more content can be found on my Vimeo profile</h5>
        <div className='nameplate'>
             {/*<h2 className='vibrant'> Bitrate: <a>Low </a> | High </h2>*/}
      </div>
      <div id="gallery-grid">
        { vNames.sort().map((vInfo) =>
                         (<Player
                           loop={true}
                           fluid={false}
                           width={vInfo.size.width/3}
                           height={vInfo.size.height/3}
                           playsInLine
                           poster={`http://pfgallery-ebb6.kxcdn.com/thumbs/${pparse(vInfo.name).name + '.png'}`}
                           src={`http://pfgallery-ebb6.kxcdn.com/${this.state.bitrate}/${pparse(vInfo.name).name + '.mp4'}`}
                         />))  }
      </div>
        </Fade>;

  }
}

export default VideoGrid;
