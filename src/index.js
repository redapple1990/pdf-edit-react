import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import 'semantic-ui-css/semantic.min.css'
import { pdfjs } from 'react-pdf';
// import * as serviceWorker from './serviceWorker';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

ReactDOM.render(<App />, document.getElementById('root'));

// serviceWorker.unregister();
