import {BehaviorSubject} from "rxjs";
import Firebase from "./firebase";
import {ITContact} from "../contacts/contact-table-definition";

export class Data {

    static instance;
    public contacts: BehaviorSubject<ITContact[]> = new BehaviorSubject([] as ITContact[]);
    public chats: BehaviorSubject<any[]> = new BehaviorSubject([] as any[]);
    constructor(private fb: Firebase) {
        console.log('INIT DATA CONTEXT');
        if (Data.instance || false) {
            console.log('FIXME !!!!!! Data callled two time');
            return Data.instance;
        }
        Data.instance = this;
        this.fb.getUserContact().onSnapshot((querySnapshot) => {
            const contacts = [] as any[];
            querySnapshot.forEach(q => {
                contacts.push({...q.data(), key: q.data().phoneNumber, id: q.data().phoneNumber});
            });
            this.contacts.next(contacts);
        });
        this.fb.getUserChats().onSnapshot((querySnaphost) => {
            const chats = [] as any[];
            querySnaphost.forEach(q => {
                const lastMessage = q.data().lastMessage;
                console.log(lastMessage);
                chats.push({
                    key: lastMessage.from,
                    from: lastMessage.from,
                    to: lastMessage.to,
                    message: lastMessage.message,
                    ts: lastMessage.createdAt})
            });
            this.chats.next(chats);
        })
    }
}
