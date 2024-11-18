from pinecone import Pinecone
import os
from dotenv import load_dotenv
from openai import OpenAI
from uuid import uuid4
from scraping import FAQScraper

load_dotenv(dotenv_path="../../../.env")

pinecone_api_key = os.environ.get("PINECONE_API_KEY")
openai_api_key = os.environ.get("OPENAI_API_KEY")

openai_client = OpenAI(api_key=openai_api_key)
pc = Pinecone(api_key=pinecone_api_key)
index = pc.Index('pocketworld')

def prepare_text(article):
    text = f"Title: {article['title']}\n\n"
    
    for section in article['content']['sections']:
        text += f"Section: {section['heading']}\n"
        
        for content in section['content']:
            if content['type'] == 'paragraph':
                text += f"{content['text']}\n\n"
            elif content['type'] == 'list':
                for item in content['items']:
                    text += f"• {item}\n"
                text += "\n"
    
    if article.get('related_articles'):
        text += "Related Articles:\n"
        for related in article['related_articles']:
            text += f"• {related['title']}\n"
    print("this text", text)
            
    return text

def process_data(collections):
    vectors = []
    for collection in collections:
        for article in collection['articles']:
            text = prepare_text(article)
            embedding = openai_client.embeddings.create(
                model="text-embedding-3-small",
                input=text
            ).data[0].embedding
            vectors.append({
                "id": str(uuid4()), 
                "values": embedding,
                "metadata": {
                    "title": article['title'],
                    "collection": collection['name'],
                    "text": text
                }
            })
    return vectors

def batch_upsert(vectors, batch_size=100):
    for i in range(0, len(vectors), batch_size):
        batch = vectors[i:i + batch_size]
        index.upsert(
            vectors=batch,
            namespace="faq" 
        )

# uncomment to run webscraping and batch upsert
if __name__ == "__main__":
    scraper = FAQScraper()
    collections = scraper.get_collections()
    vectors = process_data(collections)
    batch_upsert(vectors)