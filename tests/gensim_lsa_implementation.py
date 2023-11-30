import gensim
from gensim import corpora
from gensim.models import LdaModel, Word2Vec
from gensim.utils import simple_preprocess


print("program started ")
documentpaths = ['tests\document1.txt',
                 'tests\document2.txt', 'tests\document3.txt']
documents = []
for documentpath in documentpaths:
    with open(documentpath, 'r') as file:
        documents.extend(line.strip() for line in file)
tokenized_doc = [simple_preprocess(doc) for doc in documents]
# for i in tokenized_doc:
#     print(" ".join(i), "\n")

dictionary = corpora.Dictionary(tokenized_doc)
a = dict(dictionary)
print(a)
print(dictionary)
