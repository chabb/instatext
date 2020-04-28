import {config} from './config';
import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import {Collection} from "./db";
import {BehaviorSubject, Subject} from "rxjs";
import {ITContact} from "../contacts/contact-table-definition";

interface User {
    uid: string,
    emailVerified: boolean,
    email: string | null;
}

export class Firebase {

    public auth: firebase.auth.Auth;
    private db: firebase.firestore.Firestore;
    public currentUser: User | null = localStorage.getItem('authUser') !== null ? JSON.parse(localStorage.getItem('authUser')!) : null;
    public sessionInitialized = new BehaviorSubject(false);

    constructor() {
        console.log('>>>>>>>>>>.', config);
        const fbapp = firebase.initializeApp(config);
        this.auth = firebase.auth();
        this.db = firebase.firestore();
        this.onAuthUserListener((authenticatedUser) => {
            this.currentUser = authenticatedUser;
            localStorage.setItem('authUser', JSON.stringify(authenticatedUser));
        }, () => {
            this.currentUser = null;
            localStorage.setItem('authUser', JSON.stringify(null));
        })
    }

    doCreateUserWithEmailAndPassword = (email, password) =>
        this.auth.createUserWithEmailAndPassword(email, password);
    doSignInWithEmailAndPassword = (email, password) => {
        this.sessionInitialized.next(false);
        return this.auth.signInWithEmailAndPassword(email, password);
    };
    doSignOut = () => {
        this.sessionInitialized.next(false);
        this.currentUser = null;
        this.auth.signOut();
    };
    doPasswordReset = email => this.auth.sendPasswordResetEmail(email);
    doPasswordUpdate = password => {
        if (this.auth.currentUser) {
            this.auth.currentUser.updatePassword(password);
        }
    };
    doSendEmailVerification = () => {
        if (this.auth.currentUser) {
            return this.auth.currentUser.sendEmailVerification({
                url: config.emailRedirect!
            });
        }
    };
    // when a user has signed up
    onAuthUserListener = (next, fallback) => {
        console.log('0-00');
        return this.auth.onAuthStateChanged(authUser => {
            console.log('find new user', authUser);
            if (authUser) {
                this.getUser(authUser.uid).get().then((doc) => {
                    const dbUser = doc.data();
                    const user  = {
                        ...dbUser,
                        uid: authUser.uid,
                        email: authUser.email,
                        emailVerified: authUser.emailVerified,
                    };
                    next(user);
                    console.log('>CU', user);
                    this.sessionInitialized.next(true);
                })
            } else {
                console.log('NO USER');
                this.sessionInitialized.next(true);
                fallback();
            }
        }, (e) => {
            console.log(e);
        });
    };
    // DB
    addUser = (user:{uid: string, email:string, emailVerified: boolean}) => {
        return this.db.collection(Collection.USERS).doc(user.uid).set(user);
    };
    addContactToCurrentUser = (contact: ITContact) => {
        return this.addContactToUser(this.auth.currentUser!.uid, contact);
    };
    addMessage = (toPhoneNumber: string, message) => {

        // fetch the chatroom, if it does notexist, creates it
        const chat = this.db.collection(Collection.USERS)
            .doc(this.currentUser!.uid)
            .collection(Collection.CHATROOM)
            .doc(toPhoneNumber);
        return chat.get().then((d) => {
            console.log('C', d.exists);
                if (d.exists) {
                    return chat.collection(Collection.MESSAGES).doc().set({
                        message: message,
                        to: toPhoneNumber,
                        from: 'from'
                    })
                } else {
                   return chat.set({contacts: toPhoneNumber}).then(() => {
                       return chat.collection(Collection.MESSAGES).doc().set({
                           message: message,
                           to: toPhoneNumber,
                           from: 'from'
                       })
                   })
                }
            })


    };
    checkContact = (phoneNumber) => {
        const userUid = this.auth.currentUser!.uid;
        return this.db.collection(Collection.USERS).doc(userUid).collection(Collection.CONTACT)
            .doc(phoneNumber);
    };
    checkEmail = (email) => {

    };
    getUserContact = () => {
        return this.db.collection(Collection.USERS).doc(this.auth.currentUser!.uid).collection(Collection.CONTACT);
    };
    addContactToUser = (userUid: string, contact: ITContact) => {
        return this.db.collection(Collection.USERS).doc(userUid).collection(Collection.CONTACT)
            .doc(contact.phoneNumber).set(contact).then(function(d) {
            console.log("Document successfully written!");
            return d;
        }).catch((e) => { console.log(e); return Promise.reject(e);  });
    };
    getUser = (uid: string) => {
        return this.db.collection('users').doc(uid);
    };
}

export default Firebase;
