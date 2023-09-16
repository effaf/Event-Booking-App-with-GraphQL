const bcrypt = require('bcryptjs');
const Event = require('../../models/events');
const User = require('../../models/userSchema');

// function call to get User, so whenever the query calls this function will be called
const getUser = async userId => {

    try{
        const user = await User.findById(userId)
        return {...user._doc, 
                _id: user.id,
                 createdEvents: getEvents.bind(this, user._doc.createdEvents)};
    }
    catch(err){
        throw err
    }
}
// Same for function to get the events, this way we can drill inside our code
const getEvents = async eventIds => {
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

// Making the schema of graph QL, all the resolvers for query and mutation
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

createEvent : async (args)=> {
    const event = new Event({
        title: args.eventInput.title,
        description : args.eventInput.description,
        price : +args.eventInput.price,
        date: new Date(args.eventInput.date),
        creator:'65045fa8cf9b049ea32127d0'
    })

    try{
        
        const result = await event.save()
        let newEvent = {...result._doc,_id : result.id};

        const currentUser = await User.findById('65045fa8cf9b049ea32127d0');
        if(!currentUser){
                throw new Error("User does not exist");
                 }

        currentUser.createdEvents.push(event);
        await currentUser.save()
        return newEvent;

    }catch(err){
        throw err;
    }
},
createUser : async (args) => {

        try
        {
            const currentUser = await User.findOne({email:args.userInput.email});
            if(currentUser){

                    throw new Error("User Exists")
            }else{
                const hashedPassword = await bcrypt.hash(args.userInput.password, 12);
                const user = new User({
                        email: args.userInput.email,
                        password: hashedPassword
                })
                const result = await user.save()
                return {...result._doc, password:null, _id:result.id}

            }
        }
        
        catch(err){
            throw err
        }
    
}
}