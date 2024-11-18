from flask import Flask, jsonify, request
from flask_cors import CORS
from scraping import FAQScraper
from pinecone import Pinecone
import os
from dotenv import load_dotenv
import openai
from openai import OpenAI
from uuid import uuid4

load_dotenv(dotenv_path="../../.env")

app = Flask(__name__)
CORS(app)

pinecone_api_key = os.environ.get("NEXT_PUBLIC_PINECONE_API_KEY")
openai_api_key = os.environ.get("NEXT_PUBLIC_OPENAI_API_KEY")

openai.api_key = openai_api_key
pc = Pinecone(api_key=pinecone_api_key)
index = pc.Index('pocketworld')
openai_client = OpenAI()

@app.route('/chat', methods=['POST'])
def chat():
    user_question = request.json.get('question')
    
    question_embedding = openai_client.embeddings.create(
        model="text-embedding-3-small",
        input=user_question
    ).data[0].embedding
    
    query_response = index.query(
        namespace="faq",
        vector=question_embedding,
        top_k=3,  
        include_metadata=True
    )
    
    matches = query_response.matches
    contexts = [match.metadata['text'] for match in matches]
    
    return jsonify({
        "matches": contexts
    })
    


    
if __name__ == "__main__":
    app.run(debug=True)
