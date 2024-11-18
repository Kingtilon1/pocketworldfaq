The chatbot will now be accessible at `http://localhost:3000`.

## Usage

1. Open the chatbot in your web browser.
2. Type your question in the input field and press "Send".
3. The chatbot will respond with the most relevant information from the FAQ content.

## Supported vs. Unsupported Questions

The chatbot is designed to provide accurate and relevant responses based on the available FAQ content. If a user's question cannot be satisfactorily answered using the FAQ data, the chatbot will acknowledge its limitations and suggest contacting Highrise support.

The chatbot logs all questions and responses, including cases where the question could not be answered in the `./logs/questions.log` file. Unanswered or "unsupported" questions are logged in the `./logs/unresolved.log` file. 

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
