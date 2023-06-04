import axios from "axios";
import { useState } from "react";

/* eslint-disable */
import FetchedData from "./components/FetchedData"; // eslint-disable-line
import PdfViewer from "./components/PdfViewer";
import FormSignUp from "./components/FormSignUp";
import FormSignIn from "./components/FormSignIn";
import UserHome from "./components/UserHome";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [file, setFile] = useState(null);
  const [isUserPresent, setIsUserPresent] = useState(false);

  const handelPDFChange = (e) => {
    setSelectedFile(e.target.files[0]);
    console.log(e.target.files[0]);
  };

  const onClickHandler = () => {
    const data = new FormData();
    data.append("file", selectedFile);
    axios
      .post("/api/uploadpdf", data, {
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
  };

  const isUser = () => {
    setIsUserPresent(false);
    setIsUserPresent(true);
  };

  return (
    <div className="App">
      <FormSignUp isUser={isUser} />
      <FormSignIn isUser={isUser} />
      <br />
      <br />
      <br />

      {isUserPresent && (
        <div>
          <input
            type="file"
            name="file"
            onChange={handelPDFChange}
            accept=".pdf"
            required
          />
          <button
            type="button"
            onClick={onClickHandler}
            disabled={!selectedFile}
          >
            Upload
          </button>
          <FetchedData
            encodeURL={encodeURL}
            selectedFile={selectedFile}
            isUserPresent={isUserPresent}
          />
          <PdfViewer pdfFile={"data:application/pdf;base64," + file} />
        </div>
      )}
      <Router>
        <Routes>
          <Route path="/:id" element={<UserHome />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
