import { useEffect, useState } from "react";
import {io} from 'socket.io-client';

// initialize the socket instacne OUTSIDE the component
// this prevents creating a new connection every time the  component re-renders.
const URL = import.meta.env.PROD
  ? "https://notepad-server-hqk9.onrender.com"
  : "http://localhost:3001";
const socket = io(URL);

function App(){
  const [room, setRoom] = useState("");
  const [joined, setJoined] = useState(false);
  const [text, setText] = useState(""); // state to hold the notepad content

  useEffect(() => {
    // listen for text updates from the server
    socket.on("receive_message", (data) => {
      setText(data.message);
    });
    return () => socket.off("receive_message");
  }, [socket]);

  const joinRoom = () => {
    if (room !== ""){
      // send a join_room event to the server
      socket.emit("join_room", room);
      setJoined(true);
    }
  };

  const handleTextChange = (e) => {
    const newText = e.target.value;
    setText(newText);
    socket.emit("send_message", { message: newText, room: room });
  };
    

  return (
    <div style={{ padding: '40px', textAlign: 'center', fontFamily: 'sans-serif' }}>
      {!joined ? (
        <div className="join-container">
          <h2>Collaborative Notepad</h2>
          <input
            type="text"
            placeholder="Enter Room ID (e.g. 123)"
            onChange={(e) => setRoom(e.target.value)}
            style={{ padding: '10px', marginRight: '10px' }}
          />
          <button onClick={joinRoom} style={{ padding: '10px 20px', cursor: 'pointer' }}>
            Join Room
          </button>
        </div>
      ) : (
        <div className="notepad-container">
          <h3>Room: {room}</h3>
          <textarea
            value={text}
            onChange={handleTextChange}
            placeholder="Start typing..."
            style={{ 
              width: '80%', 
              height: '300px', 
              padding: '15px', 
              fontSize: '16px',
              borderRadius: '8px'
            }}
          />
          <br /><br />
          <button onClick={() => { setJoined(false); setText(""); }}>Leave Room</button>
        </div>
      )}
    </div>
  );
}

export default App;