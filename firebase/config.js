import admin from "firebase-admin";

import { createRequire } from "module"; // Bring in the ability to create the 'require' method
const require = createRequire(import.meta.url); // construct the require method

// CHANGE: The path to your service account
var serviceAccount = require("../doanhoikhkttt-firebase-adminsdk-f98nz-0295c12847.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: "doanhoikhkttt.appspot.com"
});

var bucket = admin.storage().bucket();

export { bucket }