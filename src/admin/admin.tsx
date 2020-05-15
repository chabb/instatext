import React, {useContext} from 'react'
import FirebaseContext from "../firebase/context";

export const Admin = () => {

    const fb = useContext(FirebaseContext)!;



    return <div>
        <div style={{marginBottom:20}}>
            <b> Manage my account</b>
        </div>


        <div><b> Login Info: </b></div>
        <p>{
            fb.currentUser!.email} <br/>
            <a> Reset my password </a>
        </p>


        <div><b>Phone number associated with this account:</b></div>
        <p>{fb.currentUser!.phoneNumber}</p>

        <p><b> Plan: </b></p>

        <p><b> Usage: </b></p>
    </div>
}
