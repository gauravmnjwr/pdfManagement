import axios from "axios";
import React, { useState } from "react";

function UploadPdf({ getfile }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [file, setFile] = useState(null);

  const handelPDFChange = (e) => {
    setSelectedFile(e.target.files[0]);
    console.log(e.target.files[0]);
  };

  const onClickHandler = () => {
    const data = new FormData();
    data.append("file", selectedFile);
    axios
      .post("api/uploadpdf", data, {
        // receive two    parameter endpoint url ,form data
      })
      .then((res) => {
        // then print response status

        console.log(res.statusText);
      });
  };
  const encodeURL = (url) => {
    // console.log(url);
    setFile(url);
    getfile(url);
  };
  return (
    <>
      <input
        type="file"
        name="file"
        onChange={handelPDFChange}
        accept=".pdf"
        required
      />
      <button type="button" onClick={onClickHandler} disabled={!selectedFile}>
        Upload
      </button>
    </>
  );
}

export default UploadPdf;
