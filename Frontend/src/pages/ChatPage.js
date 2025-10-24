import { useEffect, useState } from "react";
import io from "socket.io-client";
import axios from "axios";

const socket = io("http://localhost:5000");

const ChatPage = ({ taskId, usertype }) => {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);

  useEffect(() => {
    socket.emit("joinChat", taskId);
    axios
      .get(`http://localhost:5000/api/chats/${taskId}`)
      .then((res) => setChat(res.data?.messages || []))
      .catch(() => {});
  }, [taskId]);

  const sendMessage = async () => {
    if (!message.trim()) return;
    const data = { taskId, sender: usertype, message };
    await axios.post("http://localhost:5000/api/chats", data);
    socket.emit("sendMessage", { roomId: taskId, ...data });
    setChat((prev) => [...prev, { sender: usertype, message }]);
    setMessage("");
  };

  useEffect(() => {
    socket.on("receiveMessage", (data) => {
      if (data.taskId === taskId) setChat((prev) => [...prev, data]);
    });
    return () => socket.off("receiveMessage");
  }, [taskId]);

  return (
    <div>
      <div className="chat-box">
        {chat.map((msg, i) => (
          <p key={i}>
            <strong>{msg.sender}:</strong> {msg.message}
          </p>
        ))}
      </div>
      <input value={message} onChange={(e) => setMessage(e.target.value)} />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default ChatPage;
