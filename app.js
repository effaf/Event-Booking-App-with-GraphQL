const express = require('express');
const mongodb = require('mongodb');
const mongoose = require('mongoose')
const bodyParser = require('body-parser');

// Getting the necessary files
const graphqlSchema = require('./graphql/schema/index');
const resolverFunctions = require('./graphql/resolvers/index');

const {graphqlHTTP} = require('express-graphql');


const app = express();

app.use(bodyParser.json());


app.use('/graphql', graphqlHTTP({

    schema: graphqlSchema,
    rootValue: resolverFunctions,
    graphiql:true

    }))

mongoose.connect(`mongodb+srv://juliebryan998:${process.env.MONGO_PASS}@cluster0.8otyy0m.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`)
    .then(()=>{
        app.listen(3000); 
    })
    .catch(err=>{
        console.log(err)
    })