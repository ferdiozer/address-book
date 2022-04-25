

/*
  _____                .___.__                             
  _/ ____\___________  __| _/|__|   ____________ ___________ 
  \   __\/ __ \_  __ \/ __ | |  |  /  _ \___   // __ \_  __ \
   |  | \  ___/|  | \/ /_/ | |  | (  <_> )    /\  ___/|  | \/
   |__|  \___  >__|  \____ | |__|  \____/_____ \\___  >__|   
             \/           \/                  \/    \/       
                                                ferdiozer.com
*/


import React, { Suspense } from 'react';


import { Provider } from 'react-redux'
import { store } from './store'


import Loading from './components/LoadingMain'

import './App.css';


import Router from "./router";




const AppWrapper = () => {
  return (
    <Provider store={store}>
      <Suspense fallback={(<Loading />)}>
        <Router />
      </Suspense>
    </Provider>
  );
};




export default AppWrapper;
