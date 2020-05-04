import * as functions from 'firebase-functions';
import {Twilio} from 'twilio';
import {MessageInstance, MessageStatus} from "twilio/lib/rest/api/v2010/account/message";
// The Firebase Admin SDK to access the Firebase Realtime Database.
import * as admin from 'firebase-admin';
//import MessagingResponse = require("twilio/lib/twiml/MessagingResponse");
//import * as cors from 'cors';

const cors = require('cors')({
    origin: true,
});

admin.initializeApp();
const db = admin.firestore();


/*Listen for changes in all documents in the 'users' collection
exports.useWildcard = functions.firestore
    .document('users/{userId}/chatroom/{chatroomCollectionId}/messages/{messageId}')
    .onCreate((change, context) => {
        // event can be sent twice, so we might need to check in the DB if the message has been sent
        const id = context.params.userCollectionId;
        const phone =  context.params.chatroomCollectionId;
        //const email ?//
        console.log(id, phone);
        // If we set `/users/marie` to {name: "Marie"} then
        // context.params.userId == "marie"
        // ... and ...
        // change.after.data() == {name: "Marie"}
    });*/


exports.sendMessage = functions.https.onCall(({to, from, message, subAccountId}, context): Promise<SendMessageResponse> => {
    const token = functions.config().twilio.token;
    const sid = functions.config().twilio.sid;
    if (!context.auth! || !context.auth!.uid) {
        throw new functions.https.HttpsError('failed-precondition', 'The function must be called ' +
            'while authenticated.');
    }
    if (!from || !to || !message) {
        throw new functions.https.HttpsError('unauthenticated', 'missing from/to/message field');
    }

    // subaccounts need their own phone numbers
    const client = new Twilio(sid, token); //{ accountSid: subAccountId });
    const textContent: any = {
        body: message,
        to: to,
        from: from,
        accountSid: subAccountId,
        statusCallback: 'https://us-central1-instatext-27374.cloudfunctions.net/webhook'
    };
    return client.messages.create(textContent)
        .then((m: MessageInstance) => ({
                from:m.from,
                to:m.to,
                id:m.sid,
                status:m.status
            })
        )
        .catch(e => {
            throw new functions.https.HttpsError('internal', 'Message:' + e)
        });
});


export interface SendMessageResponse {
    from: string,
    to: string,
    id: string,
    status: MessageStatus
}

exports.createSubaccount = functions.https.onCall(({friendlyName, userId}, context): Promise<SubAccountResponse>  => {
    //TODO(chab) lazy initialization of twilio client
    console.log('create subaccount called');
    const sid = functions.config().twilio.sid;
    const token = functions.config().twilio.token;
    const client = new Twilio(sid, token);
    console.log('Create subaccount for', friendlyName, userId);
    return client.api.accounts.create({friendlyName: 'Submarine'})
        .then(account => {
            console.log('created account', account);
            return {subAccountId:account.sid}
        }, (e) => {
            console.log('Failed to create', e);
            throw new functions.https.HttpsError('internal', 'Message:' + e)
        });
});


exports.createPhone = functions.https.onCall(({subAccountId}) => {
    // this will create a phone, and assign it immediately to the user subaccount
    // once the user subaccount is created, it updates the firestore database


    const sid = functions.config().twilio.sid;
    const token = functions.config().twilio.token;
    const client = new Twilio(sid, token);
    return client.availablePhoneNumbers('US')
        .local
        .list({smsEnabled: true, beta:false, limit: 10})
        .then(local => {
            console.log(local);
            return local[0].phoneNumber})
        .then(phoneNumber => client.incomingPhoneNumbers.create({
            statusCallback: 'https://us-central1-instatext-27374.cloudfunctions.net/webhook',
            smsUrl: 'https://us-central1-instatext-27374.cloudfunctions.net/sendMessage',
            phoneNumber:phoneNumber
        }))
        .then(i => {
            console.log('created', i);
            return i;
        })
        .then((incoming_phone_number: any) => {
            console.log('success');
            return {sid:incoming_phone_number.sid, phoneNumber: '+12073864877'}
        })
        .then(({sid, phoneNumber}) => {
            console.log('will update', phoneNumber, ' to', subAccountId);
            return client.incomingPhoneNumbers(sid)
                .update({accountSid: subAccountId})
        })
        .then(incoming_phone_number => {
            return incoming_phone_number.sid;
        });
});

interface SubAccountResponse {
    subAccountId: string;
}


// [START trigger]
//https://us-central1-instatext-27374.cloudfunctions.net/webhook
exports.webhook = functions.https.onRequest((req, res) => {
    // [END trigger]
    // [START sendError]
    // Forbidding PUT requests.
    console.log('received request');
    if (req.method === 'GET' || req.method === 'PUT' || req.method === 'DELETE' ) {
        return res.status(403).send('Forbidden!');
    }
    // [END sendError]
    // [START usingMiddleware]
    // Enable CORS using the `cors` express middleware.
    console.log('will response the thing', req.body);
    //    SmsStatus: 'delivered',
    //    MessageStatus: 'delivered',
    //    To: '+41798843958',
    //    MessageSid: 'SMf835763169154d9d9577ca3acec8ed84',
    //    AccountSid: 'ACf4382285c8585fdabef1bc684075040c',
    //    From: '+19145590987'
    const from = req.body.From;
    const status = req.body.SmsStatus;
    const msStatus = req.body.messageStatus;
    const to = req.body.To;
    const id = req.body.MessageSid;

    return cors(req, res, () => {
        // [END usingMiddleware]
        // Reading date format from URL query parameter.
        // [START readQueryParam]
        //admin.firestore().db.collectionGroup('')
        // normal flow, sent -> delivered
        const messages = db.collectionGroup('messages')
            .where('sid', '==', id);
        messages.get().then(function (querySnapshot) {
            if (querySnapshot.size > 1) {
                throw new functions.https.HttpsError('internal', 'Duplicate message' + id);
            } else {
                console.log('will update', status, msStatus);
                querySnapshot.docs[0].ref.update({status}).then(() => {
                    console.log('status updated for ', id, from, to, status)
                }, (e) => {
                    console.log('error updating status', e);
                })
            }
        }, (e) => {
            console.log('error finding message', e);
        });
        res.status(200).send('hello');
        // [END sendResponse]
    });
});

/*
exports.incoming = functions.https.onRequest((req, res) => {
    let isValid = true;
    const sid = functions.config().twilio.sid;
    const token = functions.config().twilio.token;

    // Only validate that requests came from Twilio when the function has been
    // deployed to production.
    if (process.env.NODE_ENV === 'production') {
      //
    }

    // Halt early if the request was not sent from Twilio
    if (!isValid) {
        res
            .type('text/plain')
            .status(403)
            .send('Twilio Request Validation Failed.')
            .end();
        return;
    }

    const { From, To, Body, MessageSid, AccountSid } = req.body;

    // find message subcollection


    // Send the response
    res
        .status(200)
        .type('text/xml')
        .end('hello');
});

// [END all]
/*
"account_sid": "ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
    "api_version": "2010-04-01",
    "body": "McAvoy or Stewart? These timelines can get so confusing.",
    "date_created": "Thu, 30 Jul 2015 20:12:31 +0000",
    "date_sent": "Thu, 30 Jul 2015 20:12:33 +0000",
    "date_updated": "Thu, 30 Jul 2015 20:12:33 +0000",
    "direction": "outbound-api",
    "error_code": null,
    "error_message": null,
    "from": "+15017122661",
    "messaging_service_sid": "MGXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
    "num_media": "0",
    "num_segments": "1",
    "price": null,
    "price_unit": null,
    "sid": "MMXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
    "status": "sent",
    "subresource_uris": {
    "media": "/2010-04-01/Accounts/ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX/Messages/SMXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX/Media.json"
},
"to": "+15558675310",
    "uri": "/2010-04-01/Accounts/ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX/Messages/SMXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX.json"
}*/


// we can store <from>.<to> pair to get the right chatroom
