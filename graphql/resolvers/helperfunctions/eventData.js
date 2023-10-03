const Event = require('../../../models/events');
const getUser = require('./userData');


module.exports = getEvents = async eventIds => {
    try {
    const events = await Event.find({_id:{$in : eventIds}})
    const eventsWithCreators = await Promise.all(
        events.map(async (event) => {
            const creator = await getUser(event.creator);
            return {
                ...event._doc,
                _id: event.id,
                creator: creator,
                date: new Date(event._doc.date).toISOString()
            };
        })
    );
    
    return eventsWithCreators;

    } catch(err) {
        throw err
    }
}

module.exports = singleEvent = async eventId => {
    try{
    const currentEvent = await Event.findById(eventId);
    return {
        ...currentEvent._doc,
        _id:currentEvent.id,
        creator: getUser(currentEvent.creator)
    }
    }catch(err){
        throw err;
    }
}