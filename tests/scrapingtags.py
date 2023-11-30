import requests
from bs4 import BeautifulSoup


def scrape(url: str):
    print(url)
    response = requests.get(url)
    print(BeautifulSoup.prettify(response))


scrape("https://pottasfarmworld.com/")
