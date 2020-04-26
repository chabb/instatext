import React, {useContext, useEffect} from 'react';
import './email.less';
import { MailOutlined} from '@ant-design/icons';
import {Badge} from "antd";
import FirebaseContext from "../firebase/context";
import {useHistory} from "react-router";


export const EmailVerification = () => {

    const firebase = useContext(FirebaseContext);
    const history = useHistory();

    useEffect(() => {
        if (!firebase || !firebase.currentUser) {
            history.push('/signup');
            return;
        } else if (firebase.currentUser.emailVerified) {
            history.push('/home');
        }
    }, []);

    // can be wrapped in a component
    return firebase!.currentUser && <div className="email">
        <div className="header">
            Verify you are human to start using Instatext
        </div>
        <div className="body">
            <div className="message">
                <p>We sent an email to <b> {firebase!.currentUser!.email} </b></p>
                <p>To continue, please check your email and verify your account by clickin on the link we sent you</p>
            </div>
            <div className="icon">
                <Badge count={1}>
                    <MailOutlined style={{fontSize: '5rem'}}/>
                </Badge>
            </div>
        </div>
    </div>;
}
