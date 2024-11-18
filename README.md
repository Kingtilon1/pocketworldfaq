Checkout the live chatbot [HERE](https://pocketworldfaq.vercel.app/)

# Highrise FAQ Chatbot

This is a Next.js-based chatbot that provides answers to frequently asked questions (FAQs) about the Highrise game. It uses a combination of Pinecone vector database and OpenAI's language model to deliver accurate and contextual responses.

## Features

- **Pinecone Vector Database**: The chatbot scrapes the Highrise support website and stores the FAQ content in a Pinecone vector database for efficient retrieval.
- **OpenAI Language Model**: When a user asks a question, the chatbot uses the Pinecone vector database to retrieve the most relevant FAQ content, which is then used as context for the OpenAI language model to generate a response.
- **Logging and Reporting**: The chatbot logs all user questions and responses, including cases where the question could not be satisfactorily answered using the available FAQ content. Unanswered or "unsupported" questions are tracked separately.

## Setup

1. Clone the repository:
git clone https://github.com/Kingtilon1/pocketworldfaq.git
2. Create a `.env.local` file in the root directory and add the following environment variables:
PINECONE_API_KEY=your_pinecone_api_key
NEXT_PUBLIC_OPENAI_API_KEY=your_openai_api_key
3. Install the required packages:
npm install
## Python Scripts

The chatbot relies on two Python scripts:

1. **embedding.py**: This script is responsible for web scraping the Highrise support website, processing the FAQ content, and storing the data in the Pinecone vector database.

2. **app.py**: This script is the main entry point for the chatbot's API routes, handling user questions and generating responses using the Pinecone vector database and OpenAI language model.

To run the Python scripts, follow these steps:

1. Navigate to the directory containing the `embedding.py` and `app.py` files:
cd path/to/python/scripts
2. Install the required Python packages:
pip install -r requirements.txt
3. Run the `embedding.py` script:
python embedding.py
This will scrape the Highrise FAQ content, create embeddings, and upsert the data to the Pinecone vector database.
5. Start the chatbot server:
npm run dev
The chatbot will now be accessible at `http://localhost:3000`.

## Usage

1. Open the chatbot in your web browser.
2. Type your question in the input field and press "Send".
3. The chatbot will respond with the most relevant information from the FAQ content.

## Logging and Reporting

The chatbot logs all user questions and responses, including cases where the question could not be answered, to the Firestore database.

Resolved questions are logged with the `isResolved` field set to `true`, and unresolved or misclassified questions are logged with the `isResolved` field set to `false`.

You can access the logged data through the Firestore console or by integrating the data into your own reporting and analysis tools.

## Sample Interactions

**Supported Question**:
User: How do I update my billing information?
Chatbot: According to the FAQ, to update your billing information:

1. Log into your Highrise account.
2. Go to the "Billing" section.
3. Click on "Update Billing Information".
4. Enter your new payment details and save the changes.

If you have any trouble with this process, please contact Highrise support for further assistance.

**Unsupported Question**:
User: When will Highrise be available on mobile devices?
Chatbot: I'm sorry, but I don't have any information about Highrise's mobile plans in the FAQ content. This is not a question I can answer reliably based on the data I have access to. I'd suggest checking the Highrise website or contacting their support team for the latest updates on mobile availability.
