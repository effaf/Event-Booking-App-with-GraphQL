const User = require('../../../models/userSchema');
const getEvents = require('./eventData');

module.exports =  getUser = async userId => {

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
