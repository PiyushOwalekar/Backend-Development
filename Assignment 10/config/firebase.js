const admin = require('firebase-admin');

function getFirebaseConfig() {
    const { FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY } = process.env;
    if (!FIREBASE_PROJECT_ID || !FIREBASE_CLIENT_EMAIL || !FIREBASE_PRIVATE_KEY) {
        throw new Error('Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY in .env');
    }

    return {
        credential: admin.credential.cert({
            projectId: FIREBASE_PROJECT_ID,
            clientEmail: FIREBASE_CLIENT_EMAIL,
            privateKey: FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
        })
    };
}

if (!admin.apps.length) admin.initializeApp(getFirebaseConfig());

const db = admin.firestore();

async function verifyFirebaseConnection() {
    await db.listCollections();
    console.log('Firebase connected successfully');
}

module.exports = { admin, db, verifyFirebaseConnection };
