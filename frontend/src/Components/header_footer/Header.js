import React from "react";
import {AppBar, Button, Toolbar} from '@mui/material';
import { NavLink, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";


const Header = ()=>{
    const {user, logout} = useAuth();
    return(
        <AppBar style = {{
            backgroundColor:'#2f2f2f',
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
                    <Button color="inherit">Events</Button>
                </Link>
                {user ? <Link to='/bookings'>
                    <Button color="inherit">Bookings</Button>
                </Link> :null}
                {user ? <Link to='/events'>
                    <Button color="inherit" onClick={()=>{logout()}}>Sign out</Button>
                </Link>:
                <Link to='/signin'>
                    <Button color="inherit">Sign in</Button>
                </Link>
                }
            </div>
        </Toolbar>
        </AppBar>
        
    )
}

export default Header;