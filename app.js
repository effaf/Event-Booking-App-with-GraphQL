const express = require('express');
const mongodb = require('mongodb');
const mongoose = require('mongoose')
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');


const {graphqlHTTP} = require('express-graphql');
const {buildSchema} = require('graphql');

// Getting models
const Event = require('./models/events');
const User = require('./models/userSchema');

const app = express();


app.use(bodyParser.json());


app.use('/graphql', graphqlHTTP({

    schema: buildSchema(`

        type Event {
            _id : ID!,
            title: String!,
            description : String!,
            price : Float!,
            date : String!
            creator: User!
        }

        type User {
            _id: ID!,
            email: String!,
            password : String
            createdEvents: [Event!]
        }

        input UserInput {
            email: String!
            password: String!
        }

        input EventInput{
            title: String!
            description: String!
            price: Float!
            date: String!
        }
 
        type rootQuery{
            events: [Event!]!
        }
        type rootMutation{
            createEvent(eventInput: EventInput): Event
            createUser(userInput : UserInput): User

        }
        schema {
            query: rootQuery
            mutation: rootMutation
        }
    `),
    rootValue:{
        events:()=>{
            return Event.find().populate('creator')
                 .exec()
                 .then(events=>{
                    return events.map(event=>{
                        return {...event._doc, _id : event._doc._id.toString(),
                                creator:{
                                    ...event._doc.creator._doc, 
                                    _id: event._doc.creator.id
                                }}
                    })
                 })
                 .catch(err=>{
                    console.log(err);
                    throw err;
                 })
        },
        createEvent : (args)=> {
            const event = new Event({
                title: args.eventInput.title,
                description : args.eventInput.description,
                price : +args.eventInput.price,
                date: new Date(args.eventInput.date),
                creator:'65045fa8cf9b049ea32127d0'
            })

            return event.save().then((result)=>{
                let newEvent = {...result._doc,_id:result.id};

                return User.findById('65045fa8cf9b049ea32127d0')
                            .then(user=>{
                                if(!user){
                                    throw new Error("User does not exist");
                                }
                                user.createdEvents.push(event);
                            return user.save()
                                       .then(result=>{
                                                return newEvent
                                           })
                            })

            }).catch(err=>{
                console.log(err);
                throw err;
            })
        },
        createUser :(args) => {
            return User.findOne({email:args.userInput.email})
                .then(user => {
                    if(user){
                        throw new Error("User Exists")
                    }else{
                        return bcrypt.hash(args.userInput.password, 12)
                        .then(hashedPassword => {
                            const user = new User({
                                email: args.userInput.email,
                                password: hashedPassword
                        })
                            return user.save()
                                       .then((result)=>
                                        {
                                            return {...result._doc, password:null, _id:result.id}
                                        })
                                        .catch(err=>{
                                            throw err;
                                        })
                        })
                        .catch(err => {
                            throw err;
                        })

                    }
                })
                .catch(err=>{
                    console.log(err);
                    throw err;
                })
            
        }},
        graphiql:true

    }))

mongoose.connect(`mongodb+srv://juliebryan998:${process.env.MONGO_PASS}@cluster0.8otyy0m.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`)
    .then(()=>{
        app.listen(3000); 
    })
    .catch(err=>{
        console.log(err)
    })