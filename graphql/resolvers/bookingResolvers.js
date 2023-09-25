const Booking = require('../../models/bookingSchema');
const Event = require('../../models/events');

const getUser = require('./helperfunctions/userData');
const {singleEvent} = require('./helperfunctions/eventData');


module.exports = {

    bookings: async (args,req) => {

        if(!req.isAuth){
            throw new Error("Authentication failed")
        }
        try{
        const bookings =  await Booking.find();
        return bookings.map(booking=>{
            return{
                ...booking._doc,
                _id : booking.id,
                user: getUser.bind(this,booking._doc.userId),
                event: singleEvent.bind(this,booking._doc.eventId),
                createdAt: new Date(booking._doc.createdAt).toISOString(),
                updatedAt: new Date(booking._doc.updatedAt).toISOString()
            }
        })
    }catch(err){
        throw err;
    }

},

bookEvent: async (args, req)=> {
        if(!req.isAuth){
            throw new Error("Authentication failed")
        }
        const fetchedEvents = await Event.findById({ _id : args.eventId });
        const booking = new Booking({
            userId: req.userId ,
            eventId: fetchedEvents
        });

        const result = await booking.save();
        return {
            ...result._doc,
            _id:result.id,
            createdAt: new Date(booking._doc.createdAt).toISOString(),
            updatedAt: new Date(booking._doc.updatedAt).toISOString()

        }

    },


cancelBooking: async (args, req) => {

    if(!req.isAuth){
        throw new Error("Authentication failed")
    }

    try{
    const currentBooking = await Booking.findById({ _id : args.bookingId }).populate('eventId');

    const eventDetails =  {
        ...currentBooking.eventId._doc,
        _id : currentBooking.eventId.id,
        creator: getUser.bind(this, currentBooking.eventId._doc.creator)
    }

    await Booking.deleteOne({_id : args.bookingId});
    return eventDetails;

    }catch(err){
        throw err;
    }

}
}