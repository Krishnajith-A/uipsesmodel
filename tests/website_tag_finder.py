import requests
from bs4 import BeautifulSoup


def get_website_labels(url):
    # Fetch the website's HTML content
    response = requests.get(url)
    html_content = response.content

    # Parse the HTML content using BeautifulSoup
    soup = BeautifulSoup(html_content, 'html.parser')

    # Extract potential labels from the website's title, meta tags, and domain name
    title = soup.find('title')
    potential_labels = []

    if title:
        title_words = title.text.split()
        potential_labels.extend(title_words)

    meta_tags = soup.find_all('meta')
    for meta_tag in meta_tags:
        if meta_tag.get('name') == 'keywords':
            keyword_words = meta_tag.get('content').split()
            potential_labels.extend(keyword_words)

    domain_name = url.split('/')[2]
    domain_name_parts = domain_name.split('.')
    if len(domain_name_parts) > 2:
        top_level_domain = domain_name_parts[-1]
        potential_labels.append(top_level_domain)

    return potential_labels


# Example usage
url = "https://pottasfarmworld.com/"
website_labels = get_website_labels(url)
print("Website labels:", list(set(website_labels)))
