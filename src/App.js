import React, { Component } from 'react';
//import Lottie from 'react-lottie';
import About from './about.js';

import Navigator from './navigator.js';
import VideoGrid from './videogrid.js';
import Fade from 'react-reveal/Fade';
class App extends Component {
  render() {
    
    const defaultOptions = {
      renderer: 'html',
      loop: true,
      autoplay: true,
      //animationData: require('./bats.json'),
      rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice'
    }
    };
    return (
      <div className="App">
        {/*
        <Lottie id='batsAnim' options={defaultOptions}
              height={400}
              width={1920}
              isStopped={false}
              isPaused={false} />
        */}
        <div className='nameplate'>
          <Fade bottom  text>
            <h1 className='vibrant'> Kevin Poli </h1>
            <h2 className='vibrant'> Developer | Director | Technical Artist </h2>
          </Fade>
        </div>
        <hr className='grad-hr vibrant' />
          <Navigator active='grid'/>

      </div>
    );
  }
}

export default App;
