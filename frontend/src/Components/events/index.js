import React, {useEffect,useState} from 'react';
import { Button } from '@mui/material';
import axios from 'axios';
import EventList from './eventList';
import Modal from './modal';

const Events = ()=>{

    const [events, setEvents] = useState([]);
    const [modal, setModal] = useState(false);

    let getEventQuery = `query{
        events{
            title
            date
        }
    }`

    

    useEffect(()=>{

        async function getEvents (){
            try{
                const eventList = await axios({
                    url:"http://localhost:8000/graphql",
                    method:'post',
                    headers:{
                        'Content-Type':'application/json'
                    },
                    data: {query: getEventQuery}
                })
                setEvents(eventList.data.data.events);
                }
                catch(err){
                    throw(err);
                }
        }

        getEvents();
    },[])

    useEffect(() => {
      }, [events]);
    
    return(
        
        <div className={modal ? "events_container overlay" : "events_container"}>
            <div className={modal ? 'button-events' : ''}>
                <Button variant='contained' 
                        onClick={()=>{setModal(true)}}>Create Event</Button>
            </div>
            {modal ? <Modal modal = {modal} setModal ={(value) =>{setModal(value)}}/> : null }
            
            {events.map((event) => (
            <EventList event={event} key={event.title}/>
            ))}
            
        </div>
    )
}

export default Events;