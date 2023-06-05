import { useEffect, useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";

// Import Worker
import { Worker } from "@react-pdf-viewer/core";
// Import the main Viewer component
import { Viewer } from "@react-pdf-viewer/core";
// Import the styles
import "@react-pdf-viewer/core/lib/styles/index.css";
// default layout plugin
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
// Import styles of default layout plugin
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import { useParams, useNavigate } from "react-router-dom";

import axios from "axios";
import io from "socket.io-client";
const socket = io.connect("http://localhost:5000");
var flag = false;

function ViewPDF() {
  const [pdfFile, setPdfFile] = useState("");
  const { id } = useParams();
  const navigate = useNavigate();

  //Room State
  const [room, setRoom] = useState(id);

  // Messages States
  const [message, setMessage] = useState("");
  const [allMessages, setAllMessages] = useState([]);
  const url = window.location.href;

  const token = localStorage.getItem("token");
  if (!token) {
    navigate("/");
  }
  const joinRoom = () => {
    if (room !== "") {
      socket.emit("join_room", room);
    }
  };

  useEffect(() => {
    joinRoom();
  }, []);

  useEffect(() => {}, [allMessages]);

  const sendMessage = () => {
    socket.emit("send_message", { message, room });
  };

  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  useEffect(() => {
    const getPdf = async () => {
      const { data } = await axios.get(`/pdf/${id}`);
      console.log();
      setPdfFile("data:application/pdf;base64," + data.base64Data);
    };
    getPdf();
  }, [id]);
  useEffect(() => {}, [pdfFile]);
  useEffect(() => {
    socket.on("receive_message", (data) => {
      if (flag) {
        setAllMessages((prevState) => [...prevState, data.message]);
      }
      flag = !flag;
    });
  }, [socket]);
  console.log(allMessages);

  return (
    <div className="container">
      <div className="viewer">
        {pdfFile ? (
          <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.6.172/build/pdf.worker.min.js">
            <Viewer
              fileUrl={pdfFile}
              plugins={[defaultLayoutPluginInstance]}
            ></Viewer>
          </Worker>
        ) : (
          <>
            <div className="loader-container">
              <div className="spinner"></div>
            </div>
          </>
        )}

        {/* render this if we have pdfFile state null   */}
        {!pdfFile && <>No file is selected yet</>}
      </div>
      <div className="rightaside">
        <div>
          <p>Share this PDF with your logged in Friends</p>
          <CopyToClipboard text={url}>
            <button>Copy URL to the clipboard</button>
          </CopyToClipboard>
        </div>
        <div className="message-box">
          <h1> Message:</h1>
          {/* {messageReceived} */}
          {allMessages &&
            allMessages.map((m, i) => {
              return (
                <div className="message-tiles" key={i}>
                  {m}
                </div>
              );
            })}
        </div>
        <div className="message-inp-box">
          <input
            placeholder="Message..."
            onChange={(event) => {
              setMessage(event.target.value);
            }}
          />
          <button onClick={sendMessage}> Send Message</button>
        </div>
        <div className="room-box">
          <input
            placeholder="Room Number..."
            value={room}
            onChange={(event) => {
              setRoom(event.target.value);
            }}
          />
          <button onClick={joinRoom}> Join Room</button>
        </div>
      </div>
    </div>
  );
}

export default ViewPDF;
