import os
import datetime
# from posix import environ
from route_config import *
from flask import make_response, jsonify, request
from google.oauth2 import id_token
from google.auth.transport import requests
from functools import wraps


def auth_required(f):
    @wraps(f)
    def decorator(*args, **kwargs):
        token = None
        if 'token' in request.headers:
            token = request.headers['access-token']
        if not token:
            return make_response('Invalid Auth Token', 401)
        try:
            idinfo = id_token.verify_oauth2_token(token, requests.Request(), os.environ['EXPO_AUTH_CLIENT_ID'])
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
    try:
        idinfo = id_token.verify_oauth2_token(token, requests.Request(), os.environ['EXPO_AUTH_CLIENT_ID'])
        uid = idinfo['sub']
        email = idinfo['email']
        name = idinfo['name']
        picture = idinfo['picture']
        # add user to db if not existed yet
        existingUser = db.users.find_one({'_id':uid})
        if not existingUser:
            new_user = db.users.insert_one({
                "_id": uid,
                "email": email,
                "name": name,
                "picture": picture
            })
        #print(idinfo)
        return make_response(jsonify({ 'user': idinfo}),  200)
    except ValueError:
        return make_response("Invalid Token!",  401)


