import React, {useEffect,useState} from 'react';
import { Button } from '@mui/material';
import axios from 'axios';
import EventList from './eventList';
import Modal from './modal';
import { useAuth } from '../../context/AuthContext';
import {
    Table, 
    TableBody,
    TableRow, 
    TableCell, 
    TableHead} from "@mui/material";

const Events = ()=>{

    const [events, setEvents] = useState([]);
    const [modal, setModal] = useState(false);
    const { user } = useAuth();
    const [createEvent, setCreateEvent] = useState(false);

    // const getEventQuery = 
    //                 `query { 
    //                         events { 
    //                             title 
    //                         } 
    //                     }`

    async function getEvents (){
        console.log("Inside events");
        try{
            console.log(user);
            if(user && user.token){
                console.log("Look for this");
            const eventList = await axios({
                url:"http://localhost:8000/graphql",
                method:'post',
                headers:{
                    "Content-Type" : "application/json"

                },
                data: {
                    query: `query {
                            events {
                                title
                                date
                                price 
                                description
                            }
                        }`
            }})

            setEvents(eventList.data.data.events);
            console.log("Send events");
            }}
            catch(err){
                throw(err);
            }
    }

    useEffect(()=>{

        getEvents();
    },[])

    useEffect(()=>{
        getEvents();

    },[createEvent])


    return(
        
        <div className={modal ? "events_container overlay" : "events_container"}>
            <div className={modal ? 'button-events' : ''}>
                <Button variant='contained' 
                        onClick={()=>{setModal(true)}}>Create Event</Button>
            </div>
            {modal ? <Modal modal = {modal} setModal ={(value) =>{setModal(value)}} setCreateEvent ={(value)=>{setCreateEvent(value)}}/> : null }

            <Table >
                    <TableHead>
                        <TableRow>
                            <TableCell>Event Name</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell>Price</TableCell>
                            <TableCell>Description</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                    {events.map((event, index) => {

                        let date = event.date.substring(0,10);
                        return(
                            <TableRow key={index}>
                                <TableCell>{event.title}</TableCell>
                                <TableCell>{date}</TableCell>
                                <TableCell>{event.price}</TableCell>
                                <TableCell>{event.description}</TableCell>
                            </TableRow>
                        )})}
                    </TableBody>
            </Table>
            
        </div>
    )
}

export default Events;