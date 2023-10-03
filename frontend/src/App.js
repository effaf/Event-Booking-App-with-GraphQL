import React from "react";
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import Signin from './Components/signin'
import Header from './Components/header_footer/Header';
import {AuthProvider} from "./context/AuthContext";
import Events from "./Components/events";
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import Bookings from "./Components/bookings";


function App() {

  return (
    <BrowserRouter>
    <AuthProvider>
    
      <Header/>
      <Routes>

        <Route path="/signin" element={<Signin/>}></Route>
        <Route path="/events" element={<Events/>}></Route>
        {/* <Route path="/dashboard" element={<Home/>}></Route>
        <Route path="/events" element={<Events/>}></Route> */}
        <Route path="/bookings" element={<Bookings/>}></Route>

      
      </Routes>
    
    </AuthProvider>
    
    <ToastContainer position="top-left"/>
    </BrowserRouter>
  );
}

export default App;