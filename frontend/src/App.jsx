import { useEffect, useState } from "react"
import io from 'socket.io-client';
const socket = io.connect('http://localhost:3001')
import './styles.css'
const App = () => {
  const [room, setRoom] = useState('');
  const [message, setMessage] = useState('');
  const [sentMessages, setSentMessages] = useState([]);
  const [receivedMessages, setReceivedMessages] = useState([]);
  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit("sent_message", { message, room });
    setSentMessages([...sentMessages, {message:message,id:Date.now(),sent:true}]);
    setMessage('')
  }

  useEffect(() => {
    socket.on("received_message", (data) => {
      setReceivedMessages([...receivedMessages, {message:data,id:Date.now(),sent:false}]);  
    })
  },[receivedMessages])

  const messages = [...sentMessages, ...receivedMessages].sort((a, b) => {
    return a.id - b.id;
  })

  const handleRoom = (e) => {
    e.preventDefault();
    if (!room) {
      alert('Please enter your server number')
    } else {
      socket.emit('join_room', room);
    }

  }

  return (
    <>
      <div className="card col-lg-5 mx-auto my-4 p-3">
        <div className="display-3 text-center">
          Messaging App
        </div>
        <form>
          <label htmlFor="">Your Room</label>
          <input value={room} onChange={(e)=>setRoom(e.target.value)} type="text" className="form-control" placeholder="Enter your Message..." />
          <button onClick={handleRoom} className="w-100 btn btn-info my-3">
            Join Room
          </button>
          <label htmlFor="">Your Message</label>
          <input value={message} onChange={(e)=>setMessage(e.target.value)} type="text" className="form-control" placeholder="Enter your Message..." />
          <button onClick={handleSubmit} className="w-100 btn btn-info my-3">
            Send Message
          </button>
        </form>
      </div>
      <div className="col-5 m-auto border p-3 chat">
        
      {messages.map((msg) => {
        return <>
          <h5 className={`${msg.sent ? 'sent' : 'received'}`} >{msg.message}</h5>
        </>
      })}
        </div>
    </>
  )
}

export default App
