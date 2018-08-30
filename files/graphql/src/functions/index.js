const functions = require('firebase-functions');
const graphql = require('./src');

exports.graphql = functions.https.onRequest(graphql);
