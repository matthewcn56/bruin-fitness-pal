import os
import datetime
# from posix import environ
from route_config import *
from flask import make_response

@app.route('/login', methods = ['POST'])
def login_user():
    return make_response(jsonify({ 'message': 'Hello there!'}),  200)
