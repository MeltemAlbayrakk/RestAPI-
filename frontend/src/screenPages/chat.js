import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import './App.css';
 
const socket = io.connect('http://localhost:3001');
 
function Chat() {
  const [sender, setSender] = useState('');
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [typing, setTyping] = useState('');
 
  useEffect(() => {
    console.log("burdasın");
    socket.on('chat', (data) => {
      setChatHistory([...chatHistory, { sender: data.sender, message: data.message }]);
    });
 
    socket.on('typing', (data) => {
      setTyping(data ? `${data} yazıyor...` : '');
    });
 
    return () => {
      socket.off('chat');
      socket.off('typing');
    };
  }, [chatHistory]);
 
  const sendMessage = () => {
    console.log("sendmessage")
    socket.emit('chat', { message, sender });
    setMessage('');
  };
 
  const handleKeyPress = () => {
    socket.emit('typing', sender);
  };
 
  return (
    <div className="App">
      <div id="chat-wrap">
        <h2>Live Chat</h2>
        <div id="chat-window">
          {chatHistory.map((chat, index) => (
            <div key={index} className="chat-message">
              <strong>{chat.sender}:</strong> {chat.message}
            </div>
          ))}
          <div id="feedback">{typing}</div>
        </div>
        <div>
          <input
            type="text"
            id="sender"
            placeholder="Ad"
            value={sender}
            onChange={(e) => setSender(e.target.value)}
          />
        </div>
        <div>
          <input
            type="text"
            id="message"
            placeholder="Mesaj"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
          />
        </div>
        <div>
          <button id="submitBtn" onClick={sendMessage}>Gönder</button>
        </div>
      </div>
    </div>
  );
}
 
export default Chat;