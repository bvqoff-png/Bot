import { Telegraf, Markup } from "telegraf";
import fetch from "node-fetch";

// 🔹 Токен Telegram-бота
const bot = new Telegraf("8281242558:AAFy77QhAbyFe0l3QNKFlmOriiFhf43JauU");

// 🔹 Пиксель и токен Meta
const PIXEL_ID = "834147435830100";
const ACCESS_TOKEN =
  "EAAWTZA07XXoYBPj70LQWhnuQlBqKkiZCYXfdS8ClJe9ZBjc3Pckl5BUCwQ4xea4odjwTm1pUs64pnkbrikwzgifu4jH9M5asy34IGQt6Po3PP4scz2njKMw8Y09wLApio0csvbiZBgE107uo7ZAvgsy8UNTXyU8DaEiQxla2nWeXMnZBsgcc72Xrufh6wGo54mpAZDZD";

// 🔸 Реакция на /start
bot.start(async (ctx) => {
  const user = ctx.from.first_name || "friend";
  const payload = ctx.startPayload; // то, что идёт после /start

  // ✅ Если пользователь пришёл с fbclid из рекламы
  if (payload && payload.startsWith("fbclid_")) {
    const fbclid = payload.replace("fbclid_", "");
    console.log("✅ Пользователь пришёл из Facebook:", fbclid);

    // Отправляем событие Lead в Meta Conversions API
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
              fbclid: fbclid,
              external_id: ctx.from.id.toString(),
            },
          },
        ],
        access_token: ACCESS_TOKEN,
      }),
    });
  }

  // ✅ Приветственное сообщение с кнопками
  await ctx.reply(
    `Hello, ${user}! 👋\n\nEnter your promo code on the platform — the same one you saw in the ad — and get your instant bonus right now. 🎁\n\nVisit our official website to receive your money instantly 👇`,
    Markup.inlineKeyboard([
      [Markup.button.url("🌐 Go to Platform", "https://jokergreen.com/")],
      [Markup.button.url("💬 Support", "https://t.me/jokergreen_support")],
    ])
  );
});

// 🔹 Запуск бота
bot.launch();

console.log("🤖 Bot is running...");