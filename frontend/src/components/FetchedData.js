import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function FetchedData({ encodeURL, selectedFile, isUserPresent }) {
  const [files, setFiles] = useState([]);

  console.log(isUserPresent);
  const fetchFiles = async () => {
    const { data } = await axios.get("/allpdfs");
    setFiles(data);
    console.log(data);
  };

  useEffect(() => {
    fetchFiles();
  }, [isUserPresent]);

  useEffect(() => {}, [files]);
  const handleClick = (id) => {
    encodeURL(id);
    // console.log(id);
  };

  return (
    <div>
      {files.map((k, i) => {
        return (
          <ul key={i}>
            <li>{k.name}</li>
            <li>{k._id}</li>
            <li>
              <a
                href={k.path}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => handleClick(k.base64Data)}
              >
                Filepath
              </a>
            </li>
          </ul>
        );
      })}
    </div>
  );
}

export default FetchedData;
