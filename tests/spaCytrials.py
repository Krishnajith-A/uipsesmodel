import spacy
nlp = spacy.load("en_core_web_sm")

text = ("When Sebastian Thrun started working on self-driving cars at "
        "Paris to Germany then to Australia where i was drunk and high as hell")

doc = nlp(text)

print("Noun phrases:", [chunk.text for chunk in doc.noun_chunks])
print("Verbs:", [token.lemma_ for token in doc if token.pos_ == "VERB"])

# Find named entities, phrases and concepts
for entity in doc.ents:
    print(entity.text, entity.label_)

nlp = spacy.load('en_core_web_lg')

query1 = "What is the best way to learn Python"
query2 = "How can I effectively Teach myself Python"
query3 = "What is the best way to learn cooking"
query1tonlp = nlp(query1)
query2tonlp = nlp(query2)
query3tonlp = nlp(query3)
similarity_score1and2 = query1tonlp.similarity(query2tonlp)
similarity_score1and3 = query1tonlp.similarity(query3tonlp)
print("similarity score between 1 and 2 is ", similarity_score1and2)
print("Similarity score between 1 and 3 is ", similarity_score1and3)

for objects in query1tonlp.ents:
    print(objects)
    print(objects.text, objects.label_)
