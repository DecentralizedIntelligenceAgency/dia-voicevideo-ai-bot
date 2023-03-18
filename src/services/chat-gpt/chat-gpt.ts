import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export const generateCompletion = async (text: string) => {
  if (text.trim().length === 0) {
    throw new Error('No prompt');
  }

  const completion = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: text,
    max_tokens: 1000,
    temperature: 0.6,
  });

  return completion.data.choices[0].text;
};
