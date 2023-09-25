const eventResolver = require('../resolvers/eventResolvers');
const bookingResolver = require('../resolvers/bookingResolvers');
const userResolver = require('../resolvers/userResolvers');

// function call to get User, so whenever the query calls this function will be called

//Getting a single event by its id

// Making the schema of graph QL, all the resolvers for query and mutation
module.exports = {
    ...eventResolver,
    ...bookingResolver,
    ...userResolver
}