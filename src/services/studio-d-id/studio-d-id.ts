import axios from 'axios';

export const generateClipFromAudio = async (text: string) => {
  const { STUDIO_D_ID_BASE_URL, STUDIO_D_ID_API_KEY } = process.env;

  const { data: result } = await axios.post(
    `${STUDIO_D_ID_BASE_URL}/talks`,
    {
      driver_url: 'bank://lively',
      script: {
        provider: {
          type: 'microsoft',
          voice_id: 'Jacob',
        },
        input: text,
        type: 'text',
      },
      source_url: 'https://wallpaperaccess.com/full/2853747.jpg',
    },
    {
      headers: {
        Authorization: `Basic ${STUDIO_D_ID_API_KEY}`,
      },
    }
  );

  console.log({ result });

  return result;
};

export const getTalkById = async (id: string) => {
  const { STUDIO_D_ID_BASE_URL, STUDIO_D_ID_API_KEY } = process.env;

  const { data: result } = await axios.get(
    `${STUDIO_D_ID_BASE_URL}/talks/${id}`,
    {
      headers: {
        Authorization: `Basic ${STUDIO_D_ID_API_KEY}`,
      },
    }
  );

  return result;
};
