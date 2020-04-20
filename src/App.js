import React from 'react';
import { Container, Header, Grid, Form, Popup } from 'semantic-ui-react';
import { Document, Page } from 'react-pdf';
import Homepreview from './components/Homepreview';
import '../src/assets/styles.css'
import Draggable, { ControlPosition } from 'react-draggable';
import Popupsignature from './components/Dragsidebar';
import * as jsPDF from 'jspdf';
import * as html2canvas from 'html2canvas';
import styles from './assets/styles.css'
import $ from 'jquery';
import SignaturePad from 'react-signature-canvas'



class App extends React.Component {

  state = {
    file: null,
    numPages: 0,
    pageNumber: 1,
    activeDrags: 0,
    trimmedDataURL: null,
    dates: null,
    username: '',
    date: ""
  };

  componentDidMount() {
    this.date();
  }

  date(){
    var date = new Date().toDateString();
    this.setState({ date });
  }

  mySubmitHandler = (event) => {
    event.preventDefault();
  }
  myChangeHandler = (event) => {
    this.setState({ username: event.target.value });
  }

  togglText() {
    this.setState({
      showtext: !this.state.showtext
    });
  }

  sigPad = {}
  clear = () => {
    this.sigPad.clear()
  }
  trim = () => {
    this.setState({
      trimmedDataURL: this.sigPad.getTrimmedCanvas()
        .toDataURL('image/png')
    })
  }

  togglePopup() {
    this.setState({
      showPopup: !this.state.showPopup
    });
  }
  toggleDate() {
    this.setState({
      showDate: !this.state.showDate
    });
   
}
  handleDrag = (e, ui) => {
    const { x, y } = this.state.deltaPosition;
    this.setState({
      deltaPosition: {
        x: x + ui.deltaX,
        y: y + ui.deltaY,
      }
    });
  };

  onFileChange = (event) => {
    this.setState({
      file: event.target.files[0]
    });
  }

  onDocumentLoadSuccess = ({ numPages }) => {
    this.setState({ numPages });
  }

  nextPage = () => {

    const currentPageNumber = this.state.pageNumber;
    let nextPageNumber;

    if (currentPageNumber + 1 > this.state.numPages) {
      nextPageNumber = 1;
    } else {
      nextPageNumber = currentPageNumber + 1;
    }

    this.setState({
      pageNumber: nextPageNumber
    });
  }
  handlePdf() {
    var canvas_data = document.getElementsByTagName("canvas");
    var w = canvas_data.item(0).width
    var h = canvas_data.item(0).height


    var w = $(".canvas_div_pdf").width();
    var h = $(".canvas_div_pdf").height();

    var PDF_Width = w;
    var PDF_Height = (PDF_Width);
    var canvas_image_width = w;
    var canvas_image_height = h;
    console.log(canvas_image_width);

    var totalPDFPages = Math.ceil(h / PDF_Height) - 1;

    html2canvas($("#page")[0], { allowTaint: true }).then(function (canvas) {
      canvas.getContext('2d');
      console.log(canvas.height + "  " + canvas.width);

      var imgData = canvas.toDataURL("image/jpeg");
      var pdf = new jsPDF('p', 'pt', [PDF_Width, PDF_Height]);
      pdf.addImage(imgData, 'JPG', 0, 0, canvas_image_width, canvas_image_height);

      for (var i = 1; i <= totalPDFPages; i++) {
        pdf.addPage(PDF_Width, PDF_Height);
        pdf.addImage(imgData, 'JPG', 0, 0, canvas_image_width, canvas_image_height);
      }

      pdf.save("HTML-Document.pdf");
    });
  };


  render() {
    const { pageNumber, numPages, PDFWidth,date } = this.state;
    const dragHandlers = { onStart: this.onStart, onStop: this.onStop };
    return (
      <div>

        {/* <div class="sidenav">
          <a href="#about">About</a>
         
        </div> */}

        <div class="main">
        <main id="page-content-wrapper page" role="main" className="container">
          <Header textAlign="center">PDF Preview</Header>
          <button onClick={this.handlePdf} className="btn btn-primary btn-lg mx-auto">Generate PDF</button>

          <div>
            <Form>
              <div className="upload-btn">
                <input type="file" onChange={this.onFileChange} className="button-select">
                </input>
              </div>
            </Form>

            <div className="pagination-item" >
              <Grid centered columns={2}>
                <Grid.Column textAlign="center" onClick={this.nextPage}>
                  {this.state.file ? <div class="pagination">
                    <a href="#">&laquo;</a>
                    <a href="#" class="active">{pageNumber}</a>
                    <a href="#">of</a>
                    <a href="#">{numPages}</a>
                    <a href="#">&raquo;</a>
                  </div> : null}
                </Grid.Column>
              </Grid>
            </div>

            <div id="page">
              <Draggable handle="strong" >
                <div className="box no-cursor " >
                  <div className="canvas_div_pdf">
                    <Document file={this.state.file} onLoadSuccess={this.onDocumentLoadSuccess}
                      noData={<h4 className="success-file" >Please select a file</h4>} >

                      <Page pageNumber={pageNumber} width={PDFWidth} />
                    </Document>


                  </div>
                </div>
              </Draggable>
              <div className="add-sidebar">
                <div className="drag-list">
                  <Draggable cancel="strong" {...dragHandlers}   >
                    <div className={this.state.trimmedDataURL ? "drag-item-box-signture" : "drag-item-box"} onClick={this.togglePopup.bind(this)}>
                      {this.state.trimmedDataURL
                        ? <img className={styles.sigImage}
                          src={this.state.trimmedDataURL} />
                        : (<div>Signature</div>)}
                    </div>
                  </Draggable>
                  {this.state.showPopup &&
              <div className="Apps">
                <div className={styles.container}>
                  <div className={styles.sigContainer}>
                    <SignaturePad canvasProps={{ className: styles.sigPad }}
                      ref={(ref) => { this.sigPad = ref }} />
                  </div>
                  <div>
                    <button className={styles.buttons} onClick={this.clear}>
                      Clear  </button>
                    <button className={styles.buttons} onClick={this.trim}>
                      Save</button>
                    <button onClick={this.props.closePopup}>
                      Close</button>
                  </div>
                </div>
              </div>
            }

          

                </div>
                <div className="drag-list">
                  <Draggable cancel="strong" {...dragHandlers}   >
                    <div className={this.state.username ? "drag-item-box-signture" : "drag-item-box"} onClick={this.togglText.bind(this)}>
                      {this.state.username
                        ? <h1 className="date-color">{this.state.username}</h1>
                        : (<div>Initials</div>)}
                    </div>
                  </Draggable>
                  {this.state.showtext &&
              <div className="Apps">
                <form onSubmit={this.mySubmitHandler}>
                  <input
                    type='text'
                    onChange={this.myChangeHandler}
                  />
                  <input
                    type='submit'
                  />
                </form>
              </div>
            }
                </div><div className="drag-list">
                  <Draggable cancel="strong" {...dragHandlers}>
                    <div className={this.state.showDate ? "drag-item-box-signture" : "drag-item-box"} onClick={this.toggleDate.bind(this)}>
                      {this.state.showDate
                        ?
                      <div className="date-color">{date}</div>

                        : (<div>Date</div>)}
                    </div>
                  </Draggable>
                </div>
              </div>
            </div>

           


          </div>
{/* <Popupsignature></Popupsignature> */}

        </main>
        </div>

       
      </div>

    );
  }
}

export default App;