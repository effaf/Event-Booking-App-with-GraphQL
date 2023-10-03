import React,{useState} from "react";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios'
import { useAuth } from "../../context/AuthContext";
import { Navigate, useNavigate} from "react-router-dom";
import { toastError, toastSuccess } from "../tools/Tools";

const Signin = () => {

    const [isLogin, setIsLogin] = useState(true);
    const [currentState, setCurrentState] = useState("Login");
    const [error, setError]  = useState(null);
    const {user, login, logout} = useAuth();
    const navigate = useNavigate();



    const submitForm = async (values) => {
        let query = '';
        if(isLogin){
            query = `query{
                        login(email:"${values.email}", password:"${values.password}"){
                            userId
                            token
                        }
                    }`
        }else{
            query = `mutation{
                createUser(userInput:{email:"${values.email}", password:"${values.password}"}){
                    email
                }
            }`
        }

        try{
            const response = await axios({
                url: 'http://localhost:8000/graphql',
                method:'post',
                headers:{
                    'Content-Type':'application/json'
                },
                data:{query:query}
            });

            if(isLogin){
                setError(null);
                login(response.data);
                navigate('/events');    
                toastSuccess("Welcome");
            }
            else if (response.data.errors){
                const errorMessage = response.data.errors[0].message;
                toastError(errorMessage);
            }else{
                navigate('/signin');
                toastSuccess("You have been signed up. Login to continue");
                setIsLogin(true);
                setCurrentState("Login");

            }

        }catch(err){
            if(err.response.status === 500){
                setError("Authentication failed, incorrect email or password");
                return;
            }
            console.log(err);
            // toastError(err.response.data);
            throw err;
        }

    }

    const formik = useFormik({
        initialValues:{
            email:'',
            password:''
        },
        validationSchema:Yup.object({
            email:Yup.string().email("Invalid email").required("Email is required"),
            password:Yup.string().required("Password is required")
        }),
        onSubmit:(values) => {
            submitForm(values);
        }
    })

    return(
        <div className="signin-home">
            <div className="form-container">
                <form onSubmit={formik.handleSubmit} className="form-control">
                    <h2>{`Please ${currentState}`}</h2>
                    <input name="email" placeholder="Email" 
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.email}/>
                        
                    { formik.touched.email && formik.errors.email ?
                    <div className="error_label">
                        {formik.errors.email}
                    </div>
                    :null }
                    <input name="password" placeholder="Password" type="password"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.password}/>

                    { formik.touched.password && formik.errors.password ?
                    <div className="error_label">
                        {formik.errors.password}
                    </div>
                    :null }

                    <button type="submit" style={{cursor:'pointer'}}>{`${currentState}`}</button>
                    {error? <div>{error}</div> : null}

                    
                    
                </form>
                {isLogin ?
                <div style={{display:'flex', flexDirection:'column'}}>
                    <p>New user? Please sign up</p>
                    <button type="submit" style={{cursor:'pointer'}} onClick={()=>{setIsLogin(false); setCurrentState("Sign up");}}>Sign Up</button>
                </div>
                :<div style={{display:'flex', flexDirection:'column'}}>
                <p>Go back to login</p>
                <button type="submit" style={{cursor:'pointer'}} onClick={()=>{setIsLogin(true); setCurrentState("Login");}}>Go back</button>
                </div>}
            </div>
                
                
        </div>
    )
}

export default Signin;