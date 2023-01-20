import React, { useState, useEffect } from 'react'
import '../styles/Sidebar.css'
import { DonutLarge, MoreVert, Chat, SearchOutlined } from '@mui/icons-material'
import { Avatar, IconButton } from '@mui/material'
import { useStateValue } from '../ContextApi/StateProvider'
import Pusher from 'pusher-js'
import SidebarChat from './SidebarChat'
import axios from 'axios';

const Sidebar = () => {

    const [{ user }] = useStateValue();
    const [rooms, setRooms] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:5000/all/rooms").then((response) => {
            setRooms(response.data)
        })

    }, [])

    useEffect(() => {
        const pusher = new Pusher('05e1e20b1da3e5893693', {
            cluster: 'ap2'
        });

        const channel = pusher.subscribe('room');

        channel.bind('inserted', function (room) {
            console.log("inserted accessed");
            console.log(room);
            setRooms((prevRooms) => [...prevRooms, room])
        })

        channel.bind('deleted', (roomid) => {
            const newRooms = rooms.filter((room) => {
                return room._id !== roomid;
            })
            setRooms(newRooms);
        })
    })


    return (
        <div className="sidebar">
            <div className="side__header">
                <Avatar src={user.photoURL} />
                <div className="sidebar__headerRight">
                    <IconButton>
                        <DonutLarge />
                    </IconButton>
                    <IconButton>
                        <Chat />
                    </IconButton>
                    <IconButton>
                        <MoreVert />
                    </IconButton>
                </div>
            </div>
            <div className='sidebar__search'>
                <div className="sidebar__searchContainer">
                    <SearchOutlined />
                    <input placeholder='Search' />
                </div>
            </div>
            <div className='sidebar__chats'>
                <SidebarChat addNewChat />
                {
                    rooms.map((room) => (
                        <SidebarChat key={room._id} id={room._id} name={room.name} />
                    ))
                }
            </div>
        </div>
    )
}

export default Sidebar