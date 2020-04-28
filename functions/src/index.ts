import * as functions from 'firebase-functions';


// Listen for changes in all documents in the 'users' collection
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
    });
