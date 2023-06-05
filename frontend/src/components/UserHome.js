import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import FetchedData from "./FetchedData";
import { useNavigate } from "react-router-dom";

function UserHome({ token, tokenChange }) {
  //   const [token, setToken] = useState("");

  useEffect(() => {}, [token]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileUploaded, setFileUploaded] = useState("");
  const navigate = useNavigate();
  const formRef = useRef();

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
    setFileUploaded(selectedFile.name);
    setSelectedFile(null);
    formRef.current.value = null;
    // window.location.reload(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
    axios.get("/logout");
  };

  return (
    <div className="user-home">
      {token ? (
        <>
          <div>
            <a href="/" onClick={handleLogout}>
              Log Out
            </a>
            <div>
              <input
                type="file"
                name="file"
                onChange={handelPDFChange}
                accept=".pdf"
                required
                ref={formRef}
              />
              <button
                type="button"
                onClick={onClickHandler}
                disabled={!selectedFile}
              >
                Upload
              </button>
              <FetchedData newFile={selectedFile} fileUploaded={fileUploaded} />
            </div>
          </div>
        </>
      ) : (
        <>
          <div>
            <a href="/signUp">SignUp</a>
            <a href="/signIn">Log In</a>
          </div>
        </>
      )}
    </div>
  );
}

export default UserHome;
