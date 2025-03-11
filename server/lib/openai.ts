import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || "your-key-here" });

export async function generateNarrative(
  topic: string,
  ideas: Array<{ name: string; content: string }>
): Promise<{ narrative: string }> {
  try {
    const formattedIdeas = ideas.map(idea => {
      return `${idea.name}: "${idea.content}"`;
    }).join("\n\n");
    
    const prompt = `
    You are an AI designed to create fair, balanced narratives based on student input about school-related topics.
    
    Topic: ${topic}
    
    Below are ideas and insights from different students:
    
    ${formattedIdeas}
    
    Please create a 2-4 paragraph narrative that:
    1. Fairly represents all submitted ideas (no single idea should dominate)
    2. Maintains a neutral, constructive tone
    3. Organizes thoughts into a coherent structure
    4. Includes specific points mentioned by students when relevant
    5. Uses inclusive language appropriate for a school setting
    6. Avoids mentioning specific student names
    
    Return the response as a JSON object with a "narrative" key that contains the generated text.
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You are a helpful assistant that creates fair narratives from student ideas." },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" }
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("No content generated");
    }

    return JSON.parse(content);
  } catch (error) {
    console.error("Error generating narrative:", error);
    throw new Error("Failed to generate narrative. Please try again.");
  }
}
