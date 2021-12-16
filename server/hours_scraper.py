import requests
from bs4 import BeautifulSoup
import json

def get_hours():
    page = requests.get("https://web.archive.org/web/20200128183422/http://menu.dining.ucla.edu/hours")
    soup = BeautifulSoup(page.content, 'html.parser')
    results = soup.find(id="main-content")
    hours_table = results.find("table", class_="hours-table")
    meal_periods = hours_table.find("thead")
    meal_periods = meal_periods.find("tr")
    meal_periods = meal_periods.find_all("th", class_="hours-head")
    periods = []
    for meal_period in meal_periods:
        period = meal_period.text.split('/')[0]
        periods.append(meal_period.text.split('/')[0])
    periods = periods[1:]
    # print(periods)
    hours_table = hours_table.find("tbody")
    halls = hours_table.find_all("tr")

    daily_halls={}
    for period in periods:
        daily_halls[period] = {}
        for hall in halls:
            name_section = hall.find("td", class_="hours-head")
            # get name of hall
            name =  name_section.find("span", class_="hours-location").text
            # get breakfast hours if any
            period_hours= hall.find("td", class_="hours-open " + period)
            if period_hours:
                period_hours = period_hours.find("span", class_="hours-range").text
                daily_halls[period][name] = period_hours
                # print('open!')
    return daily_halls


print(get_hours())




