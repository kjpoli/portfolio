import React, { Component } from 'react';
import {Nav,  NavLink} from 'reactstrap';
import VideoGrid from './videogrid.js';
import About from './about.js';
import Resume from './resume.js';

class Navigator extends Component {
    constructor(props){
      super(props);
      this.state = {active: <VideoGrid />,
                    activeElement: 'gallery'};
    }
    render(){
       return (
         <>
         <Nav tabs>
          <NavLink className={`tab-gallery vibrant ${this.state.activeElement === 'gallery' ? 'active' : '' }`}  onClick={() => this.setState({active: <VideoGrid />, activeElement: 'gallery'})}>Gallery</NavLink>
          <NavLink className={`tab-resume vibrant ${this.state.activeElement === 'resume' ? 'active' : '' }`} onClick={() => this.setState({active: <Resume />, activeElement: 'resume'})}>Resume</NavLink>
          <NavLink className={`tab-about vibrant ${this.state.activeElement === 'about' ? 'active' : '' }`} onClick={() => this.setState({active: <About />, activeElement: 'about'})}>About</NavLink>
        </Nav>
        {this.state.active}
       </>
       );
    }

}

export default Navigator;
