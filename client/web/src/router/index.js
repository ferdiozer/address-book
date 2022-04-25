

/*
  _____                .___.__                             
  _/ ____\___________  __| _/|__|   ____________ ___________ 
  \   __\/ __ \_  __ \/ __ | |  |  /  _ \___   // __ \_  __ \
   |  | \  ___/|  | \/ /_/ | |  | (  <_> )    /\  ___/|  | \/
   |__|  \___  >__|  \____ | |__|  \____/_____ \\___  >__|   
             \/           \/                  \/    \/       
                                                ferdiozer.com
*/


import React from 'react';

import {
    BrowserRouter as Router,
    useRoutes,
} from "react-router-dom";



import HomePage from '../pages/HomePage'
import LoginPage from '../pages/LoginPage'
import RegisterPage from '../pages/RegisterPage'

const App = () => {
    let routes = useRoutes([
        { path: "/", element: <HomePage /> },
        { path: "/login", element: <LoginPage /> },
        { path: "/register", element: <RegisterPage /> },
        { path: "*", element: <HomePage /> },
    ]);
    return routes;
};



const AppRouter = () => {
    return (
        <Router>
            <App />
        </Router>
    );
};



export default AppRouter;
