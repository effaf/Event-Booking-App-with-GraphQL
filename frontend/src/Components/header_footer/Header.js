import React from "react";
import {AppBar, Button, Toolbar} from '@mui/material';
import { NavLink, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";


const Header = ()=>{
    const {user, logout} = useAuth();
    return(
        <AppBar style = {{
            backgroundColor:'#3D5A6C',
            boxShadow:'none',
            padding:'10px 0px',
            position:'fixed'

        }}>
        <Toolbar style={{display:'flex', justifyContent:'space-between'}}>
            
            <div className="heading">
                <h1>Events</h1>
            </div>
            
            <div className="menu-items">
                <Link to='/events'>
                    <Button color="inherit" style={{color:"white"}}>Events</Button>
                </Link>
                {user ? <Link to='/bookings'>
                    <Button color="inherit" style={{color:"white"}}>Bookings</Button>
                </Link> :null}
                {user ? <Link to='/signin'>
                    <Button color="inherit" style={{color:"white"}} onClick={()=>{logout()}}>Sign out</Button>
                </Link>:
                <Link to='/signin'>
                    <Button color="inherit" style={{color:"white"}}>Sign in</Button>
                </Link>
                }
            </div>
        </Toolbar>
        </AppBar>
        
    )
}

export default Header;