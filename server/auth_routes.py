import os
import datetime
# from posix import environ
from route_config import *
from flask import make_response, jsonify, request
from google.oauth2 import id_token
from google.auth import transport
from functools import wraps
import requests


def auth_required(f):
    @wraps(f)
    def decorator(*args, **kwargs):
        token = None
        if 'access-token' in request.headers:
            token = request.headers['access-token']
        if not token:
            return make_response('Invalid Auth Token', 401)
        try:
            idinfo = id_token.verify_oauth2_token(token, transport.requests.Request(), os.environ['EXPO_AUTH_CLIENT_ID'])
            uid = idinfo['sub']
            db.users.find_one_or_404({"_id":uid})
        except:
            return make_response('Invalid Auth Token', 401)
        return f(uid, *args, **kwargs)
    return decorator



# use sub as hash! pass in register boolean for if should add to user db or not
@app.route('/login', methods = ['POST'])
def verify_token():
    jsonData = request.json
    token = jsonData['token']
    refresh_token = None
    if "refreshToken" in jsonData:
        refresh_token = jsonData['refreshToken']
    try:
        idinfo = id_token.verify_oauth2_token(token, transport.requests.Request(), os.environ['EXPO_AUTH_CLIENT_ID'])
        uid = idinfo['sub']
        email = idinfo['email']
        name = idinfo['name']
        picture = idinfo['picture']
        print(idinfo)
        user_profile = {
                "_id": uid,
                "email": email,
                "name": name,
                "picture": picture
        }
        # add user to db if not existed yet
        existingUser = db.users.find_one({'_id':uid})

        # check to see if refreshToken
        if refresh_token:
            user_profile['refreshToken'] = refresh_token
        # insert if not user there
        if not existingUser:
            new_user = db.users.insert_one(user_profile)
        elif existingUser and refresh_token:
            updated_user = db.users.find_one_and_replace({"_id":uid }, user_profile)

        #print(idinfo)
        return make_response(jsonify({ 'user': user_profile}),  200)
    except ValueError:
        return make_response("Invalid Token!",  401)

@app.route('/refreshToken', methods = ['POST'])
def refresh_token():
    jsonData = request.json
    token = jsonData['token']
    params = {
        "client_id" : os.environ['EXPO_AUTH_CLIENT_ID'],
        "client_secret" : os.environ['EXPO_AUTH_CLIENT_SECRET'],
        'refresh_token' : token,
         'grant_type' : "refresh_token"
    }
    authorization_url = "https://www.googleapis.com/oauth2/v4/token"
    auth_response = requests.post(authorization_url, data=params, headers= {
        "content-type" : "application/x-www-form-urlencoded"
    })
    print(auth_response)
    print(auth_response.text)
    if auth_response.ok:
        return make_response(jsonify({ 'token' :  auth_response.json()['access-token']}), 200)
    return make_response("Error", 400)

   