import { NextResponse } from "next/server";
import { Pinecone } from "@pinecone-database/pinecone";
import OpenAI from "openai";
import { db } from '../../firebase';
import { collection, addDoc } from 'firebase/firestore';


const systemPrompt = `
# Highrise FAQ Assistant System Prompt
You are a helpful assistant for Highrise users. You use the provided FAQ content to answer questions accurately and concisely.

## Core Responsibilities:
1. Answer questions based on the official FAQ content
2. Provide clear, direct answers
3. Include relevant context when needed
4. If unsure, admit limitations and direct to official support
5: When you find specific instructions or steps in the FAQ content, include them in your response. Stay faithful to the exact information provided rather than giving generic advice.

## Response Format:
1. Direct answer to the question
2. Any relevant additional context
3. Reference to related topics if helpful

## Guidelines:
- Stay within the scope of provided FAQ content
- Be friendly but professional
- If question is unclear, ask for clarification
- If question can't be answered with FAQ content, suggest contacting support, include the words contact Highrise's support every time to indicate that its an unasnwered question
`;

export async function POST(req) {
  try {
    const data = await req.json();
    console.log("Received data:", data);

    const pc = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY,
    });
    
    const index = pc.index("pocketworld").namespace('faq');
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY, 
    });

    const userQuestion = data[data.length - 1].content;

    const embedding = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: userQuestion,
    });

    

    const results = await index.query({
      vector: embedding.data[0].embedding,
      topK: 3,
      includeMetadata: true
    });
    console.log("top 3", results)

    const context = results.matches.map(match => match.metadata.text).join("\n\n");
    
    
    const completion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Context: ${context}\n\nQuestion: ${userQuestion}` }
      ],
      model: "gpt-4o-mini",  
    });

    const responseContent = completion.choices[0].message.content;

    await addDoc(collection(db, 'questions'), {
      question: userQuestion,
      response: responseContent,
      isResolved: context && !responseContent.includes("Highrise's support"),
      timestamp: new Date().toISOString(),
    });


    return NextResponse.json({ 
      answer: responseContent
    });

  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

