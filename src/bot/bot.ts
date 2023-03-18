import axios from 'axios';
import dotenv from 'dotenv';
import TelegramBot from 'node-telegram-bot-api';
import { generateCompletion } from '../services/chat-gpt/chat-gpt';
import { generateClipFromAudio } from '../services/studio-d-id/studio-d-id';

dotenv.config();

const { BOT_TOKEN, DEPLOY_URL } = process.env;

// eslint-disable-next-line import/no-mutable-exports
let bot: TelegramBot;

if (DEPLOY_URL) {
  bot = new TelegramBot(BOT_TOKEN as string);
  bot.setWebHook(`${DEPLOY_URL}/${BOT_TOKEN}`);
} else {
  bot = new TelegramBot(BOT_TOKEN as string, {
    polling: true,
  });
}

bot.onText(/\/(showCommands|start)/, async (msg) => {
  const chatId = msg.chat.id;

  bot.sendMessage(
    chatId,
    `
  /ask <prompt> - Ask a question and receive a video reply
  /say <prompt> - Receive a video with your literal text (max 500 chars)
  `
  );
});

bot.onText(/\/say (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  try {
    if (!match) {
      bot.sendMessage(chatId, 'No text input found');
      return;
    }

    if (match[1].length > 500) {
      bot.sendMessage(
        chatId,
        `Text must have a maximum of 500 characters. You have inputed ${match[1].length}`
      );
      return;
    }

    const videoResponse = await generateClipFromAudio(match[1]);

    await axios.post(`${process.env.VIDEO_SERVICE_URL}/media`, {
      videoId: videoResponse.id,
      chatId,
    });
    bot.sendMessage(chatId, 'Generating video...');
    return;
  } catch (e: unknown) {
    bot.sendMessage(chatId, 'Something went wrong');
  }
});

bot.onText(/\/ask (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  try {
    if (!match) {
      bot.sendMessage(chatId, 'No text input found');
      return;
    }

    const chatGptCompletion = await generateCompletion(match[1]);

    if (!chatGptCompletion) {
      bot.sendMessage(chatId, 'Something went wrong, please try again.');
      return;
    }

    const videoResponse = await generateClipFromAudio(chatGptCompletion);

    await axios.post(`${process.env.VIDEO_SERVICE_URL}/media`, {
      videoId: videoResponse.id,
      chatId,
    });
    bot.sendMessage(chatId, 'Generating video...');
    return;
  } catch (e: unknown) {
    bot.sendMessage(chatId, 'Something went wrong');
  }
});

bot.on('message', (msg) => {
  console.log(msg);
});

export default bot;
