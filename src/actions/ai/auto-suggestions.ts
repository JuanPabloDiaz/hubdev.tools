'use server'

import { openai } from '@ai-sdk/openai'
import { generateText } from 'ai'

export async function generateAutoSuggestion({ input }: { input: string }) {
  try {
    // const history = await getHistory()

    // const promptHistory =
    //   history.length > 0 ? `User's Search History:\n\n${history.join('\n')}\n\n` : ''

    const { text: suggestion } = await generateText({
      model: openai('gpt-4o-mini'),
      prompt: `You are a smart and efficient auto-completion assistant designed to help users quickly complete their tech-related queries. 
      
      Your job is to complete the user's input only if it meets the following conditions:

      - Begin the suggestion with the user's partial input exactly as provided, including the exact spelling, 
      casing, and spacing.
      - The input is related to academic or technological topics, such as programming, software development, web design, 
      computer science, or other tech-related subjects. If the input is not relevant to these topics, return an empty response.
      
      When generating a suggestion:
      1. Add between 2 to 4 additional words that naturally complete the user's query. 
      These words should be relevant to technology or programming and help the user find what they are looking for.
      2. If the user's input is in a language other than English, generate the suggestion in that language.
      3. If there are any typos, misspellings, or extra spaces in the user's input, do not correct them—generate the suggestion as is.
      4. Don't generate SQL queries or other code snippets.
      
      Focus strictly on technology and programming topics. Do not generate suggestions related to non-tech subjects.

      User's Partial Input: "${input}"

      Return only the suggestion, don't include any other text, double quotes, break lines, or symbols.`
    })

    return { suggestion }
  } catch (error) {
    return { error: 'Something went wrong while generating the summary' }
  }
}
