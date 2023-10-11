import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import FetchedData from "./FetchedData";
import { useNavigate } from "react-router-dom";
import helper from "./helper/helper";
import Swal from "sweetalert2";
import HomepageComponent from "./HomepageComponent";

function UserHome({ token, tokenChange }) {
  //   const [token, setToken] = useState("");

  useEffect(() => {}, [token]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileUploaded, setFileUploaded] = useState("");
  const [message, setMessage] = useState("");
  const [currFile, setCurrFile] = useState("");
  const navigate = useNavigate();
  const formRef = useRef();

  function getExtension(filename) {
    return filename.split(".").pop();
  }

  const handelPDFChange = (e) => {
    const size = Number(e.target.files[0].size / 1000000);
    const ext = getExtension(e.target.files[0].name);
    if (size > 12.5) {
      setMessage("Please choose a PDF under 12 MB.");
      formRef.current.value = null;
    } else if (ext.toLowerCase() !== "pdf") {
      setMessage("Only PDF files are allowed");
      formRef.current.value = null;
    } else {
      setMessage("");
      setSelectedFile(e.target.files[0]);
      setCurrFile(e.target.files[0].name);
    }
  };

  const onClickHandler = () => {
    const userDetails = JSON.parse(localStorage.getItem("userDetails"));
    // data.append(userDetails.id);
    const file = selectedFile;
    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64String = e.target.result.split(",")[1];
      await axios
        .post(
          `${helper}/api/uploadpdf`,
          { base64String, currFile },
          {
            params: userDetails,
          }
        )
        .then((res) => {
          // then print response status
          setFileUploaded(selectedFile.name);
          setSelectedFile(null);
          formRef.current.value = null;
          Swal.fire("Success!", "PDF Uploaded Successfully", "success");
        });
    };
    reader.readAsDataURL(file);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
    axios.get(`${helper}/logout`);
  };

  return (
    <div className="user-home">
      {token ? (
        <>
          <div>
            <div className="logout">
              <a href="/" onClick={handleLogout}>
                Log Out
              </a>
            </div>
            <h2>Upload your PDF and start collaborating</h2>

            <div className="pdf-uploading">
              <label htmlFor="file-upload" className="custom-file-upload">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/568/568717.png"
                  alt=""
                />{" "}
                {selectedFile ? <>{selectedFile.name}</> : <>Select PDF</>}
              </label>
              <input
                type="file"
                name="file"
                onChange={handelPDFChange}
                accept=".pdf"
                required
                ref={formRef}
                id="file-upload"
              />
              <button
                type="button"
                onClick={onClickHandler}
                disabled={!selectedFile}
              >
                Upload
              </button>
              <div className="pdf-err-msg">{message}</div>
            </div>
            <FetchedData newFile={selectedFile} fileUploaded={fileUploaded} />
          </div>
        </>
      ) : (
        <>
          <HomepageComponent />
        </>
      )}
    </div>
  );
}

export default UserHome;
