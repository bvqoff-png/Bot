import { Telegraf, Markup } from "telegraf";
import fetch from "node-fetch";
import express from "express";

const bot = new Telegraf(process.env.BOT_TOKEN);

const PIXEL_ID = process.env.PIXEL_ID;
const ACCESS_TOKEN = process.env.ACCESS_TOKEN;

// Основное сообщение
bot.start(async (ctx) => {
  const user = ctx.from.first_name || "friend";

  await ctx.reply(
    `Hello, ${user}! 👋\n\nEnter your promo code on the platform — the same one you saw in the ad — and get your instant bonus right now. 🎁\n\nVisit our official website to receive your money instantly 👇`,
    Markup.inlineKeyboard([
      [Markup.button.url("🌐 Go to Platform", "https://jokergreen.com/")],
      [Markup.button.url("💬 Support", "https://t.me/jokergreen_support")],
    ])
  );

  await fetch(`https://graph.facebook.com/v17.0/${PIXEL_ID}/events`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      data: [
        {
          event_name: "Lead",
          event_time: Math.floor(Date.now() / 1000),
          action_source: "system_generated",
          event_source_url: "https://jokergreen.com/",
          user_data: {
            client_user_agent: "TelegramBot",
            external_id: ctx.from.id.toString(),
          },
        },
      ],
      access_token: ACCESS_TOKEN,
    }),
  });
});

const app = express();
app.use(express.json());
app.use(bot.webhookCallback("/api/bot"));

// Для проверки что сервер жив
app.get("/", (_, res) => {
  res.send("🤖 Bot is alive!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
