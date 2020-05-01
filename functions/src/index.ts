import * as functions from 'firebase-functions';
import {Twilio} from 'twilio';
import {MessageInstance, MessageStatus} from "twilio/lib/rest/api/v2010/account/message";
const cors = require('cors')({
    origin: true,
});



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


exports.sendMessage = functions.https.onCall(({to, from, message}, context): Promise<SendMessageResponse> => {
    console.log('start send message');
    const sid = functions.config().twilio.sid;
    const token = functions.config().twilio.token;
    if (!context.auth! || !context.auth!.uid) {
        throw new functions.https.HttpsError('failed-precondition', 'The function must be called ' +
            'while authenticated.');
    }
    if (!from || !to || !message) {
        throw new functions.https.HttpsError('unauthenticated', 'missing from/to/message field');
    }
    const client = new Twilio(sid, token);
    const textContent = {
        body: message,
        to: to,
        from: from
    };
    console.log('sending');
    return client.messages.create(textContent)
        .then((m: MessageInstance) => ({
                from:m.from,
                to:m.to,
                id:m.sid,
                status:m    .status
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


// [START trigger]
//https://us-central1-instatext-27374.cloudfunctions.net/webhook
exports.webhook = functions.https.onRequest((req, res) => {
    // [END trigger]
    // [START sendError]
    // Forbidding PUT requests.
    if (req.method === 'GET' || req.method === 'PUT' || req.method === 'DELETE' ) {
        return res.status(403).send('Forbidden!');
    }
    // [END sendError]
    // [START usingMiddleware]
    // Enable CORS using the `cors` express middleware.
    return cors(req, res, () => {
        // [END usingMiddleware]
        // Reading date format from URL query parameter.
        // [START readQueryParam]
        const from = req.body.from;
        const status = req.body.status;
        const message = req.body.sid;
        console.log(from, status, message);
        // normal flow, sent -> delivered
        res.status(200).send('hello');
        // [END sendResponse]
    });
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
