import React from 'react';


const EventList  = ({event}) => {
    return(
        <div className='event-list'>
            <p>{event.title}</p>
            <p>{event.date}</p>
        </div>
    )
}

export default EventList;