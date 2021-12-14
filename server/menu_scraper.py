import requests
from bs4 import BeautifulSoup
import json

MEAL_TIME = "Brunch"
REQUESTED_HALL = "BruinPlate"
def get_nutritional_info(recipeLink): 
    page = requests.get(recipeLink)
    soup = BeautifulSoup(page.content, 'html.parser')
    results = soup.find(id="main-content")
    container = results.find("div", class_="recipecontainer")
    if(not container):
        return {}
    container = container.find("div", class_="nfbox")

    #find calories
    calories = container.find("p", class_="nfcal")
    calories = calories.text
    # print(calories)
    info = {}
    #find nutritional info
    nutrients = container.find_all("p", class_="nfnutrient")
    value = ""
    for nutrient in nutrients:
        # print(nutrient)
        nutrientName = nutrient.find("span", class_="nfmajornutrient")
         # if it's a major nutrient
        if nutrientName:
            splitText = nutrient.text.split(" ")
            nutrientName= nutrientName.text
            value = splitText[-2]
            dv = splitText[-1]
        # else it's not a major nutrient
        else:
            splitText = nutrient.text.split(" ")
            nutrientName = " ".join(splitText[:-2])
            value = splitText[-2]
            dv = splitText[-1]
        
        info[nutrientName] = {
            'value' : value,
            "dailyValue" : dv
        }
    return(info)

def get_menu_items_from_time_and_hall(meal_time, desired_hall):
    url = 'https://web.archive.org/web/http://menu.dining.ucla.edu/Menus/' + desired_hall + '/Today'
    if desired_hall == "BruinPlate":
        url = "https://web.archive.org/web/20200229052529/http://menu.dining.ucla.edu/Menus/BruinPlate/Today"

    page = requests.get(url)
    soup = BeautifulSoup(page.content, 'html.parser')
    results = soup.find(id="main-content")
    items = results.find_all("div", class_="menu-block")
    MEAL_TIME = meal_time

    hallMenuItems = []
    for item in items:
        currentMeal = item.find("h3", class_="col-header")
        if currentMeal.text == MEAL_TIME:
                menuBars=item.find_all("ul", class_ = "sect-list")
                for menuBar in menuBars:
                    itemSections = menuBar.find_all("li", class_ = "sect-item")
                    for itemSection in itemSections:
                        menuSubsection = itemSection.find("ul", class_="item-list")
                        menuLinks = menuSubsection.find_all("li", class_="menu-item")
                        for menuLink in menuLinks:
                            menuSubLink = menuLink.find("span", class_="tooltip-target-wrapper")
                            menuItem = menuSubLink.find("a", class_="recipelink")
                            fullLink = menuItem['href']
                            # print(fullLink)
                            link = fullLink[fullLink.index("http://menu.dining.ucla"):]
                            hallMenuItem = {
                                'itemName' : menuItem.text,
                                'recipeLink' : link
                            }
                            hallMenuItems.append(hallMenuItem)
                                        
    return hallMenuItems



