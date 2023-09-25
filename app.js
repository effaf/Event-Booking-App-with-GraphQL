const express = require('express');
const mongodb = require('mongodb');
const mongoose = require('mongoose')
const bodyParser = require('body-parser');
const isAuth = require('./middleware/checkAuth');
// Getting the necessary files
const graphqlSchema = require('./graphql/schema/index');
const resolverFunctions = require('./graphql/resolvers/index');

const {graphqlHTTP} = require('express-graphql');


const app = express();

app.use(bodyParser.json());

app.use((req,res,next)=>{
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Methods','POST,GET,OPTIONS,PUT');
    res.setHeader('Access-Control-Allow-Headers','Content-Type, Authorization');
    if(req.method === 'OPTIONS'){
        return res.sendStatus(200);
    }
    next();
})

app.use(isAuth)

app.use('/graphql', graphqlHTTP({

    schema: graphqlSchema,
    rootValue: resolverFunctions,
    graphiql:true

    }))

mongoose.connect(`mongodb+srv://juliebryan998:${process.env.MONGO_PASS}@cluster0.8otyy0m.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`)
    .then(()=>{
        app.listen(8000); 
    })
    .catch(err=>{
        console.log(err)
    })