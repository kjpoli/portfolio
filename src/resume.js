import React, { Component } from 'react';
import {Document, Page} from 'react-pdf';
import { pdfjs } from 'react-pdf';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faVideo } from '@fortawesome/free-solid-svg-icons';

library.add(faDownload, faVideo);
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

class Resume extends Component {
    state = {
    pageNumber: 1
  }

  onDocumentLoadSuccess = ({ numPages }) => {
    this.setState({ numPages });
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
      </div>

       );
    }

}

export default Resume;
