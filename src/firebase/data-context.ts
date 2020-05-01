import {BehaviorSubject} from "rxjs";
import Firebase from "./firebase";
import {ITContact} from "../contacts/contact-table-definition";

export class Data {

    static instance;
    public contacts: BehaviorSubject<ITContact[]> = new BehaviorSubject([] as ITContact[]);
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
        })
    }
}
