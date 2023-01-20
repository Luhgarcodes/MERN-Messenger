import React, { useEffect, useState } from 'react'
import '../styles/SidebarChat.css'
import { Avatar } from '@mui/material'
import { Link } from 'react-router-dom'
import axios from 'axios'

const SidebarChat = ({ addNewChat, id, name }) => {

    const [seed, setSeed] = useState("");

    const createChat = async () => {
        const roomName = prompt("please Enter the room name");
        if (roomName) {
            try {
                await axios.post("http://localhost:5000/group/create", {
                    groupName: roomName
                })
            } catch (err) {
                console.log(err);
            }
        }
    }

    useEffect(() => {
        setSeed(Math.floor(Math.random() * 5000));
    }, [])



    return !addNewChat ? (
        <Link to={`/rooms/${id}`}>
            <div className="sidebarchat">
                <Avatar src={`https://avatars.dicebear.com/v2/avataaars/${seed}.svg`} />
                <div className="sidebarChat__info">
                    <h2>{name}</h2>
                </div>
            </div>
        </Link>
    ) : (
        <div className="sidebarchat" onClick={createChat}>
            <h2>Add new Chat</h2>
        </div>
    )


}

export default SidebarChat