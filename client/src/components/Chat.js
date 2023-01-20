import React, { useState, useEffect } from 'react';
import { Avatar, IconButton } from '@mui/material';
import { AttachFile, InsertEmoticon, MoreVert, SearchOutlined, DeleteOutline } from '@mui/icons-material';
import '../styles/Chat.css';
import { useStateValue } from '../ContextApi/StateProvider'
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Pusher from 'pusher-js'

const Chat = () => {

    const [seed, setSeed] = useState("");
    const [input, setInput] = useState('');
    const [{ user }] = useStateValue();
    const { roomId } = useParams();
    const [roomName, setRoomName] = useState("");
    const [updatedAt, setUpdatedAt] = useState("");
    const [messages, setMessages] = useState([]);

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!input) {
            return;
        }
        await axios.post("http://localhost:5000/messages/new", {
            message: input,
            name: user.displayName,
            timestamp: new Date(),
            uid: user.uid,
            roomId: roomId,
        })

        setInput('');
    }
    const handleDelete = async (e) => {
        e.preventDefault();
        await axios.delete(`http://localhost:5000/delete/${roomId}`)
        setRoomName("")
        setUpdatedAt("")
        console.log(`${roomName} and ${roomId} was deleted`);
    }

    useEffect(() => {
        axios.get(`http://localhost:5000/room/${roomId}`).then((response) => {
            setRoomName(response.data.name);
            setUpdatedAt(response.data.updatedAt);
        })
        axios.get(`http://localhost:5000/messages/${roomId}`).then((response) => {
            setMessages(response.data)


        })
    }, [roomId])
    // console.log(messages);
    useEffect(() => {
        setSeed(Math.floor(Math.random() * 5000));
    }, [])

    useEffect(() => {
        const pusher = new Pusher('05e1e20b1da3e5893693', {
            cluster: 'ap2'
        });

        const channel = pusher.subscribe('messages');
        channel.bind('inserted', function (newMsg) {
            setMessages(prevMessages => [...prevMessages, newMsg])
        });
    }, [])


    return (
        <div className="chat">
            <div className="chat__header">
                <Avatar
                    className='chat__avatar'
                    src={`https://avatars.dicebear.com/v2/avataaars/${seed}.svg`}
                />
                <div className="chat__headerInfo">
                    <h3>{roomName ? roomName : "Welcome to Messenger"}</h3>
                    <p> {updatedAt ? `Last Seen at ${new Date().toString().slice(0, 25)}` : "Click on any Chatroom"}</p>
                </div>
                <div className="chat__headerright">
                    <IconButton>
                        <SearchOutlined />
                    </IconButton>
                    <IconButton>
                        <AttachFile />
                    </IconButton>
                    <IconButton>
                        <MoreVert />
                    </IconButton>
                    <IconButton>
                        < DeleteOutline onClick={handleDelete} />
                    </IconButton>
                </div>
            </div>
            <div className="chat__body">
                {
                    messages.map((message, index) => (
                        <p
                            className={`chat__message ${message.uid === user.uid && 'chat__receiver'}`}
                            key={index}
                        >
                            <span className='chat__name'> {message.name}</span>
                            {message.message}
                            <span className='chat__timestamp'>
                                {new Date(message.timestamp).toString().slice(new Date(message.timestamp).toString().indexOf(" "), 25)}
                            </span>
                        </p>
                    ))
                }

            </div>
            {roomName && <div className="chat__footer">
                <InsertEmoticon />
                <form>
                    <input
                        placeholder='Type a message'
                        onChange={(e) => setInput(e.target.value)}
                        value={input}
                    />
                    <button onClick={sendMessage}>Send</button>

                </form>
            </div>}
        </div>

    )
}


export default Chat;