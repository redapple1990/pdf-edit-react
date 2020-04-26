import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Container, Header, Grid, Form, Popup } from 'semantic-ui-react';
import { Document, Page } from 'react-pdf';
import '../src/assets/styles.css'
import { Draggable, Droppable } from "react-drag-and-drop";
import { Rnd } from 'react-rnd'

import * as jsPDF from 'jspdf';
import * as html2canvas from 'html2canvas';
import styles from './assets/styles.css'
import $ from 'jquery';
import SignaturePad from 'react-signature-canvas'
import { v4 as uuid } from "uuid";

import { pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

function App(props) {
  const [file, setFile] = useState(null);
  const [numPages, SetNumPages] = useState(0);
  const [pageNumber, SetPageNumber] = useState(1);
  const [activeDrags, setActiveDrags] = useState(0);
  const [trimmedDataURL, setTrimmedDataURL] = useState(null);
  const [usertext, setUsername] = useState();
  const [date, setDate] = useState();
  const [showtext, toggleShowtext] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [showDate, setShowDate] = useState(true);

  useEffect(() => {
    useDate();
  })

  const useDate = () => {
    var date = new Date().toDateString();
    setDate(date);

  }

  const toggleDate = () => {
    setShowDate(!showDate);
  }

  const mySubmitHandler = (event) => {
    event.preventDefault();
  }

  const myChangeHandler = (event) => {
    setUsername(event.target.value);

  }

  const toggleText = (e) => {
    toggleShowtext(!showtext)

  };




  var sigPad = {}

  const clear = () => {
    sigPad.clear()
  }

  const trim = () => {

    setTrimmedDataURL(
      sigPad.getTrimmedCanvas()
        .toDataURL('image/png')
    )

    setShowPopup(!showPopup);
  }


  const togglePopup = () => {
    if (trimmedDataURL === null) {
      setShowPopup(!showPopup);
    }
  }


  const onFileChange = (event) => {
    setFile(event.target.files[0])
    console.log(file);
  }


  const onDocumentLoadSuccess = (numPages) => {
    SetNumPages(numPages);
  }

  const nextPage = () => {
    const currentPageNumber = SetPageNumber.pageNumber;
    let nextPageNumber;

    if (currentPageNumber + 1 > SetNumPages.numPages) {
      nextPageNumber = 1;
    } else {
      nextPageNumber = currentPageNumber + 1;
    }
    SetPageNumber(nextPageNumber);
  }

  const handlePdf = () => {
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
      console.log(canvas.height + " " + canvas.width);

      var imgData = canvas.toDataURL("image/jpeg",1.0);
      var pdf = new jsPDF('p', 'pt', [PDF_Width, PDF_Height]);
      pdf.addImage(imgData, 'JPG', 0, 0, canvas_image_width, canvas_image_height);

      for (var i = 1; i <= totalPDFPages; i++) {
        pdf.addPage(PDF_Width, PDF_Height);
        pdf.addImage(imgData, 'JPG', 0, 0, canvas_image_width, canvas_image_height);
      }

      pdf.save("HTML-Document.pdf");
    });

  }




  const [dragitem, setDragitem] = React.useState([])


  const onDrop = React.useCallback(
    (result) => {
      let newArray = [...dragitem]
      newArray.push(result)
      setDragitem(newArray)
    },
    console.log(dragitem)

  );

  function handleDrag(ui, index) {
    let item = dragitem
    console.log(dragitem);
  }

  return (
    <div>

      <div>

        <div className="sidenav">
          <Draggable type="dragitems" data="Signature"><a>Signature</a></Draggable>
          <Draggable type="dragitems" data="Intital"><a>Initials</a></Draggable>
          <Draggable type="dragitems" data="date"><a>Date</a></Draggable>
        </div>

        <div className="main" >

          <Droppable
            types={["dragitems"]}
            onDrop={onDrop}>
            <div className="add-background">

              <button
                onClick={handlePdf}
                className="btn btn-primary btn-lg mx-auto"> Generate PDF </button>

              {/* all-popup */}

              {showPopup && (
                <div className="Apps">
                  <div>
                    <div>
                      <SignaturePad
                        canvasProps={{
                          width: 500,
                          height: 200,
                          className: "sigCanvas",
                        }}
                        ref={(ref) => {
                          sigPad = ref;
                        }}
                      />
                    </div>
                    <div>
                      <button onClick={clear}>Clear </button>
                      <button onClick={trim}>Save</button>
                    </div>
                  </div>
                </div>
              )}


              {showtext && (
                <div className="Apps">
                  <form>
                    <input type="text" onChange={(e) => myChangeHandler(e)} />

                    <input type="submit" onClick={() => toggleText()} />

                  </form>
                </div>
              )}


              <Form>

                <div className="upload-btn">
                  <input type="file" onChange={onFileChange} className="button-select">
                  </input>
                </div>

              </Form>

              {/* <div className="pagination-item" >
                <Grid centered columns={2}>
                  <Grid.Column textAlign="center" onClick={nextPage}>
                    {file ? <div class="pagination">
                      <a href="#">&laquo;</a>
                      <a href="#" class="active">{pageNumber}</a>
                      <a href="#">of</a>
                      <a href="#">{numPages}</a>
                      <a href="#">&raquo;</a>
                    </div> : null}
                  </Grid.Column>
                </Grid>
              </div> */}
                <div className="container">

              <div className="canvas_div_pdf" id="page">
                  <Document file={file} onLoadSuccess={onDocumentLoadSuccess}
                    noData={<h4 className="success-file" >Please select a file</h4>}>
                    <Page pageNumber={pageNumber} />
                  </Document>


                {dragitem.map(item => {
                  return (
                    <>
                      <Rnd
                        onDragStop={(e, ui) => handleDrag(ui)}>


                        {/* signature */}



                        {item.dragitems == "Signature" ? (

                          <div onClick={() => togglePopup()}>
                            <div>
                              {trimmedDataURL

                                ? <img className={styles.sigImage}

                                  src={trimmedDataURL} />

                                : (<div className="items"> {item.dragitems} </div>)}
                            </div>

                          </div>

                        ) : null}



                        {item.dragitems == "Intital" && (
                          <div onClick={() => toggleText()}>
                            <div>

                              <div className="items" >
                                {usertext ? usertext : item.dragitems}
                              </div>

                            </div>
                          </div>
                        )}



                        {item.dragitems == "date" && (
                          <div onClick={() => toggleDate()}>
                            <div>
                              {showDate ? (
                                <div className="items" >
                                  {date}
                                </div>
                              ) : (
                                  <div className="items" >{item.dragitems}</div>
                                )}
                            </div>
                          </div>
                        )}



                      </Rnd>
                    </>)

                }
                )}

              </div>


              </div>


            </div>
          </Droppable>
        </div>

      </div>











    </div>

  );

}

ReactDOM.render(<App />, document.getElementById('root'));



