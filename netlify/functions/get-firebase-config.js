// This is a new server-side function.
// Its only job is to securely read your secret keys from Netlify's environment
// and send them to the web page when it loads.

exports.handler = async function(event, context) {
  return {
    statusCode: 200,
    body: JSON.stringify({
      apiKey: process.env.API_KEY,
      authDomain: process.env.AUTH_DOMAIN,
      projectId: process.env.PROJECT_ID,
      storageBucket: process.env.STORAGE_BUCKET,
      messagingSenderId: process.env.MESSAGING_SENDER_ID,
      appId: process.env.APP_ID,
      measurementId: process.env.MEASUREMENT_ID,
    }),
  };
};
