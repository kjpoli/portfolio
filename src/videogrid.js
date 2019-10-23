import React, { Component } from 'react';
import { Player } from 'video-react';
import * as videos from './videos.json';
import Fade from 'react-reveal/Fade';
import ModalImage from "react-modal-image";
const pparse = require('path-parse');

function importAll(r) {
  return r.keys().map(r);
}
const images = importAll(require.context('../public/STILLS', false, /\.(png|jpe?g|svg|tif)$/));



class VideoGrid extends Component {
    constructor(props){
        super(props);
        this.state = {bitrate: 'half',gtype: 'video' };
    }
  render() {
    let vNames = videos.default;
    let vGrid = vNames.sort().map((vInfo) =>
                         <Player
                           loop={true}
                           fluid={false}
                           width={vInfo.size.width/3.5}
                           height={vInfo.size.height/3.5}
                           preload={'none'}
                           playsInLine
                           muted
                           poster={`http://pfgallery-ebb6.kxcdn.com/thumbs/${pparse(vInfo.name).name + '.png'}`}
                           src={`http://pfgallery-ebb6.kxcdn.com/${this.state.bitrate}/${vInfo.name}`}
                         />);
      let iGrid = images.map((path) => <ModalImage className='img-display' small={path} large={path}/>);
    return <Fade bottom cascade  >

        <div className='nameplate'>
             {/*<h2 className='vibrant'> Bitrate: <a>Low </a> | High </h2>*/}
      </div>
        <div className='gallery-control'>
            <h2
              onClick={ () => this.setState({gtype: 'video'})}
              className={`big-toggle ${this.state.gtype === 'video' ? 'active' : ''}`}>
            {this.state.gtype !== 'video' ? <span className='big-toggle-text'>Video</span> : 'Video'}
          </h2>

          <h2
            onClick={ () => this.setState({gtype: 'img'})}
            className={`big-toggle ${this.state.gtype === 'img' ? 'active' : ''}`}>
            {this.state.gtype !== 'img' ? <span className='big-toggle-text'>Images</span> : 'Images'}
          </h2>

        </div>
             <h5>click or touch a video to play it </h5>
             <h5>more content can be found on my Vimeo profile</h5>
      <div id="gallery-grid">
      { this.state.gtype === 'video' ? vGrid : iGrid }
      </div>
        </Fade>;

  }
}

export default VideoGrid;
