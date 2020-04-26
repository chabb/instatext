import {config} from './config';
import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import {Collection} from "./db";
import {BehaviorSubject, Subject} from "rxjs";

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
    onAuthUserListener = (next, fallback) =>
        this.auth.onAuthStateChanged(authUser => {
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
        });
    // DB
    addUser = (user:{uid: string, email:string, emailVerified: boolean}) => {
        return this.db.collection(Collection.USERS).doc(user.uid).set(user);
    };
    getUser = (uid: string) => {
        return this.db.collection('users').doc(uid);
    };
}

export default Firebase;
