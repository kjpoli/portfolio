import React, { Component } from 'react';
import { Player } from 'video-react';
import * as videos from './videos.json';
import Fade from 'react-reveal/Fade';
const pparse = require('path-parse');

class VideoGrid extends Component {

  render() {
    let vNames = videos.default;
    return <Fade bottom cascade  >
             <h5>click or touch any animation if they do not play</h5>
             <h5>more content can be found on my Vimeo profile</h5>
      <div id="gallery-grid">
        { vNames.sort().map((vInfo) =>
                         (<Player
                          autoPlay={true}
                           loop={true}
                           fluid={false}
                           width={vInfo.size.width/3}
                           height={vInfo.size.height/3}
                           playsInLine
                           poster={`./gallery/thumbs/${pparse(vInfo.name).name + '.png'}`}
                           src={`./gallery/${vInfo.name}`}
                         />))  }
      </div>
        </Fade>;

  }
}

export default VideoGrid;
