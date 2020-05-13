import {config} from './config';
import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/functions";
import {Collection} from "./db";
import {BehaviorSubject} from "rxjs";
import {ITContact} from "../contacts/contact-table-definition";
import {SendMessageResponse} from "../../functions/src";
import {MessageStatus} from "twilio/lib/rest/api/v2010/account/message";

interface User {
    uid: string,
    emailVerified: boolean,
    email: string | null;
    phoneNumber: string;
    subAccountId: string | null;
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
        });
    }

    sendSMSMessage = (from: string, to: string, message: string) => {
        const addMessage = firebase.functions().httpsCallable('sendMessage');
        return addMessage({from, to, message, subAccountId: this.currentUser!.subAccountId}).then((result: firebase.functions.HttpsCallableResult) => {
            const answer = result.data as SendMessageResponse;
            console.log('success', result);
            return answer;
        }, (e) => {
            console.warn(e);
            return Promise.reject(e);
        });
    };

    createSubaccount = (name,id) => {
        const createSubaccount = firebase.functions().httpsCallable('createSubaccount');
        return createSubaccount({friendlyName:name, id});
    };
    createPhone = (subAccount) => {
        return firebase.functions().httpsCallable('createPhone')({subAccountId: subAccount});
    };

    getMessage = (id = 'SMd2f5fe15b1d74086b87bd9acdaab9d1b') => {
        console.log('get there ---');
        const myReviews = firebase.firestore().collectionGroup('messages')
            .where('sid', '==', id);
        myReviews.get().then(function (querySnapshot) {
            console.log('find', querySnapshot.size);
        })
    };


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
                    console.log('DBUSER', dbUser);
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
    addMessageToDb = (from: string, toPhoneNumber: string, message: string, messagesid: string, status: MessageStatus, subAccountId: string, contactName?: string) => {
        console.log('storing db', toPhoneNumber, message, messagesid);
        // fetch the chatroom, if it does notexist, creates it
        const chat = this.db.collection(Collection.USERS)
            .doc(this.currentUser!.uid)
            .collection(Collection.CHATROOM)
            .doc(toPhoneNumber);

        const doc = {
            message,
            to: toPhoneNumber,
            sid: messagesid,
            from,
            pristine: true,
            createdAt: new Date().getTime(),
            status,
            subAccountId,
            direction: 'outbound'};


        console.log('---');
        const saveMessage = () => Promise.all([
            chat.collection(Collection.MESSAGES).doc(messagesid).set(doc),
            chat.update({lastMessage: doc})
        ]);

        return chat.get().then((d) => {
            console.log('Collection exists', d.exists);
                if (d.exists) {
                    return saveMessage();
                } else {
                   return chat.set({contacts: toPhoneNumber,
                       contactName: contactName,
                       subAccountId}).then(() => {
                       return saveMessage();
                   })
                }
            });
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
    getUserChats = () => {
        return this.db.collection(Collection.USERS).doc(this.auth.currentUser!.uid).collection(Collection.CHATROOM);
    };
    getUserChat = (to) => {
        return this.db.collection(Collection.USERS).doc(this.auth.currentUser!.uid).collection(Collection.CHATROOM)
            .doc(to).collection(Collection.MESSAGES).orderBy("createdAt")
    };
    addContactToUser = (userUid: string, contact: ITContact) => {
        return this.db.collection(Collection.USERS).doc(userUid).collection(Collection.CONTACT)
            .doc(contact.phoneNumber).set(contact).then((d) => {
            console.log("Document successfully written!");
            return d;
        }).catch((e) => { console.log(e); return Promise.reject(e);  });
    };
    deleteContact = (userUid: string, contactPhoneNumber: string) => {
        return this.db
            .collection(Collection.USERS)
            .doc(userUid)
            .collection(Collection.CONTACT)
            .doc(contactPhoneNumber)
            .delete().catch((e) => { console.log(e); return Promise.reject(e);  });
    };
    getUser = (uid: string) => {
        // subAccountId
        return this.db.collection('users').doc(uid);
    };

}

export default Firebase;
