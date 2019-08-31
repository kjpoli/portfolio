import React, { Component } from 'react';
import {Document, Page} from 'react-pdf';
import { pdfjs } from 'react-pdf';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faVideo } from '@fortawesome/free-solid-svg-icons';

library.add(faDownload, faVideo);
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

class Resume extends Component {
    constructor(props){
        super(props);
        this.state = {
            pageNumber: 1,
        rendered: false
    }}

  onDocumentLoadSuccess = ({ numPages }) => {
    this.setState({ numPages, rendered: true });
  }

    render() {
    const { pageNumber } = this.state;
       return (
         <div>
           <a className='dl-button' href="./resume.pdf" download="kpoli_resume.pdf">Download  <FontAwesomeIcon icon='download'/></a>
           <a className='dl-button' href="https://vimeo.com/kpoli">Vimeo <FontAwesomeIcon icon='video'/></a>
        <Document
          className='invert'
          renderMode='svg'
          file="resume.pdf"
          onLoadSuccess={this.onDocumentLoadSuccess}
        >
          <Page width={900} pageNumber={pageNumber} />
        </Document>
           {this.state.rendered ?  <div >

           <a className='dl-button' href="./trifold.pdf" download="telescope.pdf">Telescope - Innovation Expo Display  <FontAwesomeIcon icon='download'/></a>

               <Document
           renderMode='canvas'
           file="trifold.pdf"
           onLoadSuccess={this.onDocumentLoadSuccess}
               >
           <Page width={1200} pageNumber={pageNumber} />
               </Document></div> : ''}
      </div>

       );
    }

}

export default Resume;
