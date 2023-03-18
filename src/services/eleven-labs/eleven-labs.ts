import axios from 'axios';

export const generateSpeechFromText = async (text: string) => {
  const { ELEVEN_LABS_BASE_URL, ELEVEN_LABS_API_KEY } = process.env;

  console.log({ ELEVEN_LABS_BASE_URL, ELEVEN_LABS_API_KEY });

  const { data } = await axios.post(
    `${ELEVEN_LABS_BASE_URL}/v1/text-to-speech/21m00Tcm4TlvDq8ikWAM/stream`,
    {
      text,
      voice_settings: {
        stability: 0,
        similarity_boost: 0,
      },
    },
    {
      headers: {
        'xi-api-key': ELEVEN_LABS_API_KEY,
      },
    }
  );

  console.log({ data });

  return data;
};
