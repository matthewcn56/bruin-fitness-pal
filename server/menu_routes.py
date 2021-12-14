from route_config import *
from flask import jsonify, make_response, request
from menu_scraper import get_menu_items_from_time_and_hall, get_nutritional_info

@app.route('/menu', methods = ['GET'])
def getMenu():
    args = request.args
    meal_time = args.get("mealTime")
    hall = args.get("hall")
    mealTimes = ["Breakfast", "Brunch", "Lunch", "Dinner", "Late Night"]
    halls = ["Covel", "DeNeve", "FeastAtRieber", "BruinPlate"]
    info = get_menu_items_from_time_and_hall(meal_time, hall)
    return jsonify({"info" : info}), 200
    
@app.route('/nutritionalInfo', methods = ['GET'])
def getNutritionalInfo():
    args = request.args
    recipe_num = args.get("recipeNum")
    serving = args.get("serving")
    info = get_nutritional_info("http://menu.dining.ucla.edu/Recipes/" + recipe_num + "/" + serving)
    return jsonify({ "info" : info}), 200