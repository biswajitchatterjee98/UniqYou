'use server';

import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export type CustomizationState = {
    color: string;
    texture: 'fabric' | 'silk' | 'leather' | 'denim' | 'pattern';
    description: string;
};

export async function interpretCommand(command: string, currentState: CustomizationState): Promise<CustomizationState> {
    try {
        const systemPrompt = `
      You are a fashion design assistant for "UniqYou".
      Your goal is to interpret user commands to customize a 3D dress model.
      
      CRITICAL: You must extract a HEX COLOR code from the user's request.
      - If the user says "Red", return "#FF0000".
      - If the user says "Blue", return "#0000FF".
      - If the user says "Green", return "#008000".
      - If the user says "Dark Blue", return "#00008B".
      - If the user says "Pink", return "#FFC0CB".
      
      You should output a JSON object with the following fields:
      - color: A hex code string (IMPORTANT: Must be a valid 6-char hex code).
      - texture: One of "fabric", "silk", "leather", "denim", "pattern".
      - description: A short confirmation message (e.g. "Applying a vibrant red finish.").
      
      Current state: ${JSON.stringify(currentState)}
      
      Rules:
      1. IGNORE the current state if the user suggests a new color.
      2. If the user says "Yellow", you MUST return "#FFFF00" (or similar).
      3. Do NOT say "Keeping current color" if the user mentioned a color.
      4. If the user says "Gold", return "#FFD700" and texture "silk" or "pattern".
      5. PRIORITY: Output the requested color above all else.
    `;

        const response = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: command },
            ],
            response_format: { type: 'json_object' },
        });

        const content = response.choices[0].message.content;
        if (!content) throw new Error('No response from AI');

        const result = JSON.parse(content) as Partial<CustomizationState>;

        return {
            color: result.color || currentState.color,
            texture: result.texture || currentState.texture,
            description: result.description || "Updated style.",
        };
    } catch (error) {
        console.error('AI Error:', error);
        return { ...currentState, description: "Sorry, I couldn't process that design request." };
    }
}
