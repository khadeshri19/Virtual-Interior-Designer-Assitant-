import OpenAI from 'openai';
import dotenv from 'dotenv';
dotenv.config();

async function test() {
    const apiKey = "sk_SRiAfcyyzCSo9ag7C7n9J8Ntg2Hmg5Ic";
    console.log('Testing OpenAI Key:', apiKey);
    const openai = new OpenAI({ apiKey });

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini", // Use mini as it is cheaper/faster for tests
            messages: [{ role: "user", content: "Say hello" }],
        });
        console.log('OpenAI Success:', response.choices[0].message.content);
    } catch (error: any) {
        console.error('OpenAI Error:', error.message);
    }
}

test();
