import React, {useContext} from 'react'
import FirebaseContext from "../firebase/context";
import {notification} from "antd";

export const Admin = () => {

    const fb = useContext(FirebaseContext)!;

    const resetPassword = () => {
        fb!.doPasswordReset(fb.currentUser!.email).then((s) => {
            console.log(s);
            notification.success({message:'A reset email has been sent'});
        }, (e) => {
            notification.error(e.message ? e.message : 'FAILED'); //TODO(chab) find a generic message
        });
    };

    const now = new Date();
    const month = now.getUTCMonth();
    const year = now.getUTCFullYear();

    return <div>
        <div style={{marginBottom:20}}>
            <b> Manage my account</b>
        </div>


        <div><b> Login Info: </b></div>
        <p>{
            fb.currentUser!.email} <br/>
            <a onClick={e => resetPassword()}> Reset my password </a>
        </p>


        <div><b>Phone number associated with this account:</b></div>
        <p>{fb.currentUser!.phoneNumber}</p>

        <p><b> Plan: </b></p>
        Pro - $20/m
        <br/>
        Last charge:
        <br/>
        Next charge scheduled:
        <br/>

        <p><a> Manage billing informations </a></p>

        <p><b> Usage: </b></p>
        <p>
            Total Message sent: {fb!.currentUser!.messageCounter}
            <br/>
            Message sent in the current cycle:  {fb!.currentUser![year][month]}
        </p>

        <p>If you have any requests, please don't hesitate to contact us at support@instatext.apps</p>
    </div>
}
