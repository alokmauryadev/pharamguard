
import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const client = new OpenAI({
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey: process.env.OPENROUTER_API_KEY,
});

async function main() {
    try {
        console.log("Sending request...");
        const completion = await client.chat.completions.create({
            model: 'stepfun/step-3.5-flash:free',
            messages: [
                { role: 'user', content: 'Say hello' }
            ],
            // @ts-ignore
            reasoning: { enabled: true }
        });

        console.log(JSON.stringify(completion, null, 2));
    } catch (error) {
        console.error("Error:", error);
    }
}

main();
