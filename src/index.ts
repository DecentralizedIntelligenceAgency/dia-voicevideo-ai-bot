import express, { Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import dotenv from 'dotenv';
import axios from 'axios';
import bot from './bot/bot';

dotenv.config();

const { BOT_TOKEN } = process.env;

const PORT = process.env.PORT || 3000;

const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(helmet());
app.use(express.json());

app.post(`/${BOT_TOKEN}`, async (req: Request, res: Response) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

app.post('/send-video-to-user', async (req: Request, res: Response) => {
  try {
    const { chatId, resultUrl } = req.body;

    const { data: videoData } = await axios.get(resultUrl, {
      responseType: 'arraybuffer',
    });

    bot.sendVideo(
      chatId,
      videoData,
      {},
      {
        filename: 'video.mp4',
        contentType: 'video/mp4',
      }
    );
    res.sendStatus(200);
  } catch (e) {
    res.sendStatus(500);
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
