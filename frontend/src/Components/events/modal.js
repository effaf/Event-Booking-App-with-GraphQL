import React from 'react';
import { Button } from '@mui/material';
import {useFormik} from 'formik';
import * as Yup from 'yup';
import {TextInput} from '../tools/Tools';
import axios from 'axios';
import { defaultFieldResolver } from 'graphql';
import { useAuth } from '../../context/AuthContext';

const Modal = (props)=>{

    const {user, login, logout} = useAuth();

    const submitForm = async (values)=>{
        const dateISO = new Date(values.eventDate).toISOString();
        const price = new Number(values.price);
        console.log(dateISO);
        let query = `mutation{
            createEvent(eventInput:{   
                title:"${values.eventName}",
                date:"${dateISO}",
                price:${price},
                description:"${values.description}"

            }){
                title
            }
        }`
        try{
        const response = await axios({
            url:'http://localhost:8000/graphql',
            method:'post',
            headers:{
                'Content-Type':'application/json',
                'Authorization': `Bearer ${user.token}`
            },
            data:{query : query}
        })

        console.log(response.data.data);
        props.setModal(false);
        }catch(err){
            throw(err);
        }
    }

    const formik = useFormik({
        initialValues:{
            eventName:'',
            eventDate:'',
            price: 0,
            description:''

        },
        validationSchema:Yup.object({
            eventName:Yup.string().required("Please enter a event name"),
            eventDate:Yup.date().required("Enter a date"),
            price:Yup.number().required("Enter the ticket price"),
            description:Yup.string().required("Enter description")
        }),
        onSubmit:(values)=>{
            submitForm(values)
            }
    })

    return(
        <div className='modal-container'>
            
            <form onSubmit={formik.handleSubmit} className='form-design'>
                <h2>Event details</h2>
                <TextInput formik = {formik} 
                           name = "eventName" 
                           placeholder = "Event Name" 
                           label = "Event name"/>
                <TextInput formik = {formik} 
                           name = "eventDate" 
                           placeholder = "Event Date" 
                           type="date"
                           label = "Date" />
                <TextInput formik = {formik} 
                           name = "price" 
                           placeholder = "Ticket Price" 
                           label= "Price" />
                <TextInput formik = {formik} 
                           name = "description" 
                           placeholder = "Event Description"
                           label = "Description"/><br/>

                <button type='submit'>Submit</button>
            </form>
            <Button onClick={() => props.setModal(false) } variant='contained'>Close</Button>
        </div>
    )
}

export default Modal;