import {BehaviorSubject} from "rxjs";
import Firebase from "./firebase";
import {ITContact} from "../contacts/contact-table-definition";

export enum MessageDirection {
    INBOUND = 'inbound',
    OUTBOUND = 'outbound'
}

export class Data {

    static instance;
    public contacts: BehaviorSubject<ITContact[]> = new BehaviorSubject([] as ITContact[]);
    public chats: BehaviorSubject<any[]> = new BehaviorSubject([] as any[]);
    public chat: BehaviorSubject<any[]> = new BehaviorSubject([] as any[]);

    constructor(private fb: Firebase) {
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
                    direction: lastMessage.direction,
                    message: lastMessage.message,
                    ts: lastMessage.createdAt})
            });
            this.chats.next(chats);
        })
    }

    private chatSnapshotSub;

    public startChatSnapshot(phoneNumber) {
        this.chatSnapshotSub && this.chatSnapshotSub();
        console.log('start snapshotting chat', phoneNumber);
        this.chatSnapshotSub = this.fb.getUserChat(phoneNumber).onSnapshot((querySnaphost) => {
            const chats = [] as any[];
            console.log(querySnaphost.size);
            querySnaphost.forEach(q => {
                chats.push({
                    sid: q.data().sid,
                    key: q.data().from,
                    from: q.data().from,
                    to: q.data().to,
                    direction: q.data().direction,
                    message: q.data().message,
                    ts: q.data().createdAt})
            });
            console.log(chats);
            this.chat.next(chats);
        })
    }
}


/*
private socket$: Observable<string> = new Observable<string>(
  observer => {
    this.socket.on('value', (data) => {
      let v = data['value'];
      observer.next(v);
    });

    return () => this.socket.disconnect();
  })
  .share();

public getValue(): Observable<string> {
  return this.socket$;
}

 */
