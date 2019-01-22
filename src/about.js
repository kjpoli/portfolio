import React, { Component } from 'react';
import { Container, Col } from 'reactstrap';
import Fade from 'react-reveal/Fade';

class About extends Component {
    render(){
       return  (<Fade bottom  cascade text>
        <h4>About </h4>
        <Container className='aboutgrid'>
        <Col>
        <p> Welcome to my site, I hope you like it. I am an artist and computer programmer living in
            New Jersey, where I enjoy the final stages of pursuing a Bachelor's Degree in Computer Science and a minor
          in Visual Arts & Technology at Stevens Institute of Technology.
          <br />
          <br />
           I frequently surrender my afternoons to exploring the
        landscape of animation technology in simulating dynamics and fluids, designing and fine tuning programmatic effects and building creative rendering techniques beyond photorealism.
         I specialize in processing live action video, which I frequently shoot myself into abstract and stylish animation projects; I believe that live action video captures beautiful dynamics
          of motion and light that can be synthesized into lifelike animation - and this forms the basis of my style.
        <br />
        <br />
          I otherwise enjoy playing guitar  and singing rock music with my friends, and actively engaging myself in philosophy and fine art - where I use oil paints and inking
          to sketch my ideas and train my mind's eye.
        <br />
        <br />
        </p>
                </Col>
        <Col>
        <img alt="me with my 2 camera hi8 Blackmagic Cinema Camera rig"className="aboutimg" height={300} src={'http://pfgallery-ebb6.kxcdn.com/about.JPG'} /> </Col>
                </Container>
        <hr className='vibrant' />
            This website was built with React and Webpack, it is a simple static site on gitHub pages. If you experience any problems viewing and enjoying my site consider creating an Issue on my github page.
        </Fade>);
    }

}

export default About;
