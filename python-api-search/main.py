import chromadb.utils.embedding_functions as embedding_functions
from pathlib import Path  # Python 3.6+ only
from dotenv import load_dotenv
import chromadb
from typing import Union, List

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

import pathlib
import textwrap
import os
import google.generativeai as genai
from langchain_google_genai import ChatGoogleGenerativeAI
# llm = ChatGoogleGenerativeAI()

# from IPython.display import display
# from IPython.display import Markdown
# def to_markdown(text):
#     text = text.replace('•', '  *')
#     return Markdown(textwrap.indent(text, '> ', predicate=lambda _: True))


env_path = Path('..') / '.env'
load_dotenv(dotenv_path=env_path)

GEMINI_API_KEY = os.getenv("GEMINI_API_kEY")

client = chromadb.PersistentClient(path="../chroma-data")
google_ef = embedding_functions.GoogleGenerativeAiEmbeddingFunction(
    api_key=GEMINI_API_KEY)

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel("gemini-pro")


class DuckDuckGoResult(BaseModel):
    title: str
    description: str
    rawDescription: str
    hostname: str
    icon: str
    url: str


class SearchPayload(BaseModel):
    duckduckgoResults: List[DuckDuckGoResult]
    searchterm: str
    username: str
    sessionId: str
    categoriesList: str


@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.get("/items/{item_id}")
def read_item(item_id: int, q: Union[str, None] = None):
    return {"item_id": item_id, "q": q}


@app.post("/search/")
async def search(payload: SearchPayload):
    print(payload.sessionId)
    title = [i.title for i in payload.duckduckgoResults]
    description = [i.description for i in payload.duckduckgoResults]
    url = [i.url for i in payload.duckduckgoResults]
    description_to_summarize = " ".join(description)
    searchResultSnippets = '[' + ",".join(description)+']'
    prompt = f"Summarize the following text. The text is description of few websites. so give a brief idea of the websites.: {description_to_summarize}"
    response = model.generate_content(prompt)

    # promptforJson = f"I have following text snippets, related to the search tern {payload.searchterm} My goal is to categorize each snippet using a predefined list of 100 . Please analyze each snippet and predict the most likely category from the list and if you think that any other category which is not in the list is the most appropriate for this use it then. Provide the results in a JSON format with snippet ID (1 to 10) as keys and the corresponding predicted category as values.Here are the snippets\n ${searchResultSnippets}\nHere are the categories\n${categoriesString}";
    promptforJson = f"I have the following text snippets, related to the search term '{payload.searchterm}'. My goal is to categorize each snippet using the provided list of categories. For each {len(title)}snippet, predict the most likely category from the list. If none of the listed categories seem appropriate, suggest a general category like 'Music' or 'Movie'.Here are the snippets:{searchResultSnippets} from 1 to {len(title)} Here are the categories:{payload.categoriesList} Please provide the results in JSON format with snippet ID natural number as keys and the corresponding predicted category as values."
    responseJson = model.generate_content(promptforJson)
    return {"summary": response.text, "responseJson": responseJson.text}


@app.post("/chat/")
async def chat(query: str, sessionId: str):
    collection = client.get_or_create_collection(
        sessionId, embedding_function=google_ef)
    results = collection.query(
        query_texts=[query],
        n_results=3,
    )

# collection = client.get_or_create_collection(
    #     payload.sessionId, embedding_function=google_ef)
    # # collection.add(
    #     ids=url,
    #     documents=description,
    #     metadatas=[{"title": title[i], "url": url[i]}
    #                for i in range(len(title))]
    # )
    # collection.upsert(
    #     ids=url,
    #     documents=description,
    #     metadatas=[{"title": title[i], "url": url[i]}
    #                for i in range(len(title))]
    # )
    # results = collection.query(
    #     query_texts=["bathroom ", "cars"],
    #     n_results=3,
    # )

    # return {"results": results, "collection": collection.get()}
