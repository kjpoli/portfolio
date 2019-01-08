import React, { Component } from 'react';
import Lottie from 'react-lottie';
import {Nav, NavItem, NavLink} from 'reactstrap';
import './App.scss';

class App extends Component {
  render() {
    
    const defaultOptions = {
      renderer: 'canvas',
      loop: true,
      autoplay: true,
      animationData: require('./bats.json'),
      rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice'
    }
    };
     console.log(animationData.layers);
    return (
      <div className="App">
        <Lottie options={defaultOptions}
              height={450}
              width={1920}
              isStopped={false}
              isPaused={false} />
        <div className='nameplate'>
          <h1> Kevin Poli </h1>
          <h2> Developer | Director | Technical Artist </h2>
        </div>
        <hr className='grad-hr' />
        <p> Gallery | Resume | About </p>
      </div>
    );
  }
}

export default App;
