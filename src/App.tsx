import './App.less';
import React, {useContext, useEffect, useState} from 'react';
import {Layout, Spin} from "antd";
import { UploadOutlined, UserOutlined, VideoCameraOutlined, PlusOutlined } from '@ant-design/icons';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    useLocation, Redirect
} from 'react-router-dom';
import FirebaseContext  from './firebase/context';
import Firebase from "./firebase/firebase";
import {SignIn} from "./login/signup";
import {SignUp} from "./login/signin";
import {EmailVerification} from "./login/email";
import {PrivateZone} from "./PrivateZone";
import {ResetPassword} from "./login/reset";




const fb = new Firebase();

(window as any).d = fb;

function App() {
    console.log('RENDERING APP');
    return (
        <FirebaseContext.Provider value={fb}>
            <Router>
                <Body/>
            </Router>
        </FirebaseContext.Provider>
    );
}

const hasSession = (sessionLoaded, firebase) => sessionLoaded || !!firebase!.currentUser;


function Body() {

    const location = useLocation();
    const isLoginZone = (location.pathname === '/signin'
        || location.pathname === '/reset'
        || location.pathname === '/signup'
        || location.pathname === '/email');
    const firebase = useContext(FirebaseContext);
    const [sessionLoaded, setSessionLoaded] = useState(false);
    // why-did-i-render
    // remember that useEffect is not called when the element is mounted

    useEffect(() => {
        const s = firebase!.sessionInitialized.subscribe((v) => {
            console.log('session started', v, sessionLoaded, firebase!.auth.currentUser);
            if (v !== sessionLoaded) {
                console.log('switching');
                setSessionLoaded(v);
            }
        });
        return () => s.unsubscribe();
    },[]);

    return sessionLoaded ? (
        <div className='app'>
            {isLoginZone ?
                <div className='logger'>
                    <Switch>
                        <Route path="/signin">
                            <SignIn/>
                        </Route>
                        <Route path='/signup'>
                            <SignUp/>
                        </Route>
                        <Route path='/email'>
                            <EmailVerification/>
                        </Route>
                        <Route path='/reset'>
                            <ResetPassword/>
                        </Route>
                    </Switch>
                </div>
                :
                (!!firebase!.auth.currentUser ?
               <PrivateZone/> :  <Redirect
                        to={{
                            pathname: "/signup",
                            state: {from: location}
                        }}
                    /> )}

        </div>)  : <Spin size="large" tip="Loading..."/>
}


export default App;


