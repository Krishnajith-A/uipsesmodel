import nltk
from nltk import pos_tag
from nltk.tokenize import word_tokenize

# nltk.download('punkt')
# nltk.download('averaged_perceptron_tagger')


def filter_keywords_semantically(keyword_list):
    # Tokenize and perform part-of-speech tagging
    tokens = word_tokenize(' '.join(keyword_list))
    tagged_tokens = pos_tag(tokens)

    # Define POS tags for words you consider as keywords (e.g., nouns)
    keyword_pos_tags = ['NN', 'NNS', 'NNP', 'NNPS']

    # Filter out non-keywords based on POS tags
    filtered_keywords = [word for word,
                         pos in tagged_tokens if pos in keyword_pos_tags]

    return filtered_keywords


# Example usage
keywords = ['Munnar', 'Attractions', '|', 'Munnar', 'Nearby',
            'Attractions', '|', 'Pottas', 'Fun', 'Farm', 'com']
filtered_keywords_semantic = filter_keywords_semantically(keywords)
print("Filtered Keywords (Semantic):", filtered_keywords_semantic)
