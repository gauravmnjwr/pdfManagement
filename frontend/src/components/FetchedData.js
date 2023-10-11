import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import helper from "./helper/helper";
import Swal from "sweetalert2";

function FetchedData({ encodeURL, fileUploaded }) {
  const [files, setFiles] = useState([]);
  const [query, setQuery] = useState("");
  const [searchFiles, setSearchFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const userDetails = JSON.parse(localStorage.getItem("userDetails"));

  const fetchFiles = async () => {
    await axios
      .get(`${helper}/allpdfs`, {
        params: userDetails,
      })
      .then((res) => {
        setFiles(res.data);
        setLoading(false);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    setLoading(true);
    const interval = setInterval(() => {
      fetchFiles();
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleClick = (id) => {
    console.log(id);
    navigate(`/pdf/${id}`);
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure you want to delete?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await axios.delete(`${helper}/delete/${id}`);
        // Swal.fire("Deleted!", "Your file has been deleted.", "success");
        window.location.reload();
      }
    });
  };

  const handleSearchQuery = () => {
    if (!query) {
      setSearchFiles("");
    }
    const renderedData = files.filter((e, i) => {
      return e.name.toLowerCase().includes(query.toLowerCase());
    });
    setSearchFiles(renderedData);
  };

  return (
    <div>
      <form
        action=""
        onSubmit={(e) => e.preventDefault()}
        className="search-box"
      >
        <input
          type="text"
          name="search"
          id=""
          onChange={(e) => setQuery(e.target.value)}
        />
        <button onClick={handleSearchQuery}>Search</button>
      </form>
      <div className="fetched-data">
        {query ? (
          <>
            {searchFiles.map((k, i) => {
              return (
                <div key={i} className="pdf-main">
                  <div className="pdf-image">
                    {" "}
                    <img
                      src="https://cdn-icons-png.flaticon.com/512/136/136522.png"
                      alt="PDF"
                    />
                  </div>
                  <div className="pdf-info">
                    <div className="pdf-name">{k.name}</div>
                    <div className="pdf-links">
                      <div>
                        <div
                          style={{ cursor: "pointer", color: "#3d5af1" }}
                          onClick={() => handleClick(k._id)}
                        >
                          Open
                        </div>{" "}
                      </div>
                      <div>
                        <div
                          style={{ cursor: "pointer", color: "#3d5af1" }}
                          onClick={() => handleDelete(k._id)}
                        >
                          Delete
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </>
        ) : (
          <>
            {files &&
              files.map((k, i) => {
                return (
                  <div key={i} className="pdf-main">
                    <div className="pdf-image">
                      {" "}
                      <img
                        src="https://cdn-icons-png.flaticon.com/512/136/136522.png"
                        alt="PDF"
                      />
                    </div>
                    <div className="pdf-info">
                      <div className="pdf-name">{k.name}</div>
                      <div className="pdf-links">
                        <div>
                          <div
                            style={{ cursor: "pointer", color: "#3d5af1" }}
                            onClick={() => handleClick(k._id)}
                          >
                            Open
                          </div>{" "}
                        </div>
                        <div>
                          <div
                            style={{ cursor: "pointer", color: "#3d5af1" }}
                            onClick={() => handleDelete(k._id)}
                          >
                            Delete
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
          </>
        )}
        {loading && (
          <div className="loading" data-loading-text="Loading..."></div>
        )}
      </div>
    </div>
  );
}

export default FetchedData;
