
// Example Cloud Function to set a custom claim (role) for a user.
// Deploy via Firebase Admin SDK on server-side or Cloud Functions with admin privileges.
const admin = require('firebase-admin');
admin.initializeApp();

exports.setUserRole = async (uid, role) => {
  try {
    await admin.auth().setCustomUserClaims(uid, { role });
    console.log('Custom claim set for', uid, 'role=', role);
  } catch (err) {
    console.error(err);
  }
}
