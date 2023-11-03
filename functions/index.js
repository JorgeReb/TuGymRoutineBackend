const {onRequest} = require("firebase-functions/v2/https");

const admin = require("firebase-admin");
const { getAuth } = require("firebase-admin/auth");
const { user } = require("firebase-functions/v1/auth");

admin.initializeApp();


exports.addUser = onRequest(async (request, response) => {
    try {
        const email = request.body.email;
        const password = request.body.password;
        const name = request.body.name;
        
        const currentUser = await admin.auth().createUser({
            email : email,
            password : password
        });
        
        const user = {
            "email" : email,
            "name" : name
        }
        await admin.firestore().collection('users').doc(currentUser.uid).set(user);

        response.send({success: true});
    } catch (error) {
        response.send({
            error: true,
            message: error.message,
        });
    }
});



exports.deleteUser = onRequest(async (request, response) => {
    
    try {
        const userId = request.body.uid;
        
        await admin.auth().deleteUser(userId);
        await admin.firestore().collection('users').doc(userId).delete();

        response.send({success: true});
    } catch (error) {
        response.send( {
            error: true,
            message: error.message,
        });
    }
});


