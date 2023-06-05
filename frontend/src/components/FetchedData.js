import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function FetchedData({ encodeURL, fileUploaded }) {
  const [files, setFiles] = useState([]);
  const navigate = useNavigate();

  const fetchFiles = async () => {
    const { data } = await axios.get("/allpdfs");
    setFiles(data);
  };

  useEffect(() => {
    fetchFiles();
  }, [fileUploaded]);

  useEffect(() => {
    fetchFiles();
  }, [fileUploaded]);

  const handleClick = (id) => {
    navigate(`/pdf/${id}`);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/delete/${id}`);
      console.log("PDF deleted successfully");
    } catch (error) {
      console.error(error);
    }
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
                onClick={() => handleClick(k._id)}
              >
                Filepath
              </a>{" "}
              <a href="/" onClick={() => handleDelete(k._id)}>
                Delete
              </a>
            </li>
          </ul>
        );
      })}
    </div>
  );
}

export default FetchedData;
