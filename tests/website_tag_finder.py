import requests
from bs4 import BeautifulSoup


def get_website_label(url):
    # Fetch the website's HTML content
    response = requests.get(url)
    html_content = response.content

    # Parse the HTML content using BeautifulSoup
    soup = BeautifulSoup(html_content, 'html.parser')

    # Extract potential labels from the website's title, meta tags, and domain name
    title = soup.find('title')
    if title:
        title_words = title.text.split()
        potential_labels = title_words

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

    # Identify the most frequent potential label
    label_counts = {}
    for potential_label in potential_labels:
        label_counts[potential_label] = label_counts.get(
            potential_label, 0) + 1

    if label_counts:
        most_frequent_label = max(label_counts, key=label_counts.get)
        website_label = most_frequent_label
    else:
        website_label = None

    return website_label


# Example usage
url = "https://www.pottasfarmworld.com"
website_label = get_website_label(url)
print("Website label:", website_label)
