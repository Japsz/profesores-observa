const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');
var mysql = require('mysql');
var config = require('../database/config');
var model = require('../models/evento_model');

var connection = mysql.createConnection(config);
connection.connect();

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/calendar','https://www.googleapis.com/auth/calendar.events'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json';

var modulo = {};
// Load client secrets from a local file.
fs.readFile('credentials.json', (err, content) => {
    if (err) return console.log('Error loading client secret file:', err);
    modulo.autorizar(JSON.parse(content).installed,function(auth){
       google.options({
           auth:auth
       });
    });
});
const calendar = google.calendar({version: 'v3'});
/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
modulo.autorizar = function (credentials,callback) {
    const {client_secret, client_id, redirect_uris} = credentials;
    const oAuth2Client = new google.auth.OAuth2(
        client_id, client_secret, redirect_uris[0]);
    // Check if we have previously stored a token.
    fs.readFile(TOKEN_PATH, (err, token) => {
        if (err) return getAccessToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
});
};

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getAccessToken(oAuth2Client, callback) {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES
    });
    console.log('Authorize this app by visiting this url:', authUrl);
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    rl.question('Enter the code from that page here: ', (code) => {
        rl.close();
    oAuth2Client.getToken(code, (err, token) => {
        if (err) return console.error('Error retrieving access token', err);
    oAuth2Client.setCredentials(token);
    // Store the token to disk for later program executions
    fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) console.error(err);
    console.log('Token stored to', TOKEN_PATH);
});
    callback(oAuth2Client);
});
});
};

/**
 * Lists the next 10 events on the user's primary calendar.
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
modulo.listEvents = function (obj,callback) {
    calendar.events.list(obj, (err, res) => {
        if(err){
            callback(true,'The API returned an error: ' + err);
        } else {
            const events = res.data.items;
            var lista = [];
            if (events.length) {
                events.map(function(event, i){
                    if(typeof event.extendedProperties != 'undefined'){
                        lista.push({
                            "id":event.id,
                            "title": event.summary,
                            "description": event.description,
                            "class": "event-success",
                            "url": "/calendar/getEvnt/" + event.id,
                            "start": new Date(event.start.dateTime).getTime().toString(),
                            "end": new Date(event.end.dateTime).getTime().toString(),
                            "status": event.status,
                            "idteacher": event.extendedProperties.private.idteacher,
                            "idevent": event.extendedProperties.private.idevent
                        });
                    }
                });
                callback(null,lista)
            } else {
                callback(null,[]);
            }
        }
    });
};
/**
 * Insert an event on the user's primary calendar.
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
modulo.insertEvnt = function (calendarId,obj,callback) {
    calendar.events.insert({
        calendarId: calendarId,
        resource: {
            'summary': obj.title,
            'description': obj.description,
            'start': {
                'dateTime': new Date(obj.start).toISOString(),
                'timeZone': 'America/Santiago',
            },
            'end': {
                'dateTime': new Date(obj.end).toISOString(),
                'timeZone': 'America/Santiago',
            },
            'extendedProperties': {
                'private': {idteacher: obj.idteacher,
                            idevent: obj.idevent},
            },
            'reminders': {
                'useDefault': true,
            },
            'guestsCanInviteOthers': false
        }
    }, function(err, res){
        if (err){
            callback(true,'The API returned an error: ' + err);
        } else {
            callback(null,res.data);
        }
    });
};
/**
 * Insert an event on the user's primary calendar.
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
modulo.getEvnt = function (calendarId,evntId,callback) {
    calendar.events.get({
        calendarId: calendarId,
        eventId: evntId
    }, function(err, res){
        if (err){
            callback(true,'The API returned an error: ' + err);
        } else {
            callback(null,res.data);
        }
    });
};
modulo.updEvnt = function (calendarId,evntId,body,callback) {
    calendar.events.update({
        calendarId: calendarId,
        eventId: evntId,
        resource:body
    }, function(err, res){
        if (err){
            callback(true,'The API returned an error: ' + err);
        } else {
            callback(null,res.data);
        }
    });
};
module.exports = modulo;