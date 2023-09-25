const Event = require('../../models/events');
const User = require('../../models/userSchema');
const getUser = require('./helperfunctions/userData');



module.exports = {
    events: async ()=>{
    try {
        const events = await Event.find();
        return Promise.all(events.map(event=>{
                return {...event._doc, 
                        _id : event._doc._id.toString(),
                        creator: getUser.bind(this, event._doc.creator),
                        date:new Date(event._doc.date).toISOString()
                    }
            }));
        } catch(err){
            throw err;
         }
},


createEvent : async (args, req)=> {

    if(!req.isAuth){
        throw new Error("Authentication failed");
    }
    const event = new Event({
        title: args.eventInput.title,
        description : args.eventInput.description,
        price : +args.eventInput.price,
        date: new Date(args.eventInput.date),
        creator:req.userId
    })

    try{
        
        const result = await event.save()
        let newEvent = {...result._doc,_id : result.id};

        const currentUser = await User.findById(req.userId);
        if(!currentUser){
                throw new Error("User does not exist");
            }

        currentUser.createdEvents.push(event);
        await currentUser.save()
        return newEvent;

    }catch(err){
        throw err;
    }
    }
}

