const { Telegraf } = require('telegraf')
const { message } = require('telegraf/filters')
const { PaymentGuide } = require("./Controller/ControllerPayments/PaymentGuide");
const daftarHarga = require("./Controller/ControllerDigi/PriceList");
const { keyboard, actionConfigs } = require('./Controller/dataVariable.js');
const axios = require('axios');
require('dotenv').config()

const token = process.env.TOKEN_API;
console.log(token)

const bot = new Telegraf(process.env.TOKEN_API)

async function main() {
  try {

    const harga = await daftarHarga();  
    return harga;
    console.log(harga);
  } catch (error) {
    console.error('Error:', error);
  }
}

bot.start(ctx => {
  console.log(ctx)
  ctx.reply('Welcome')
})

bot.command('oldschool', (ctx) => ctx.reply('Hello'))

bot.command('payment', async (ctx) => {
  console.log(ctx.message.chat.id)
  const message = "Halo! Silakan pilih opsi di bawah ini:";

  await bot.telegram.sendMessage(ctx.message.chat.id, message, keyboard);
  // ctx.reply('Hello')
})

bot.command('produk', async (ctx) => {
  const chatId = ctx.message.chat.id
  main().then(data => {
    function createInlineKeyboard(data) {
      const categories = [...new Set(data.map(product => product.category))];
      const inlineKeyboard = categories.map(category => ({
        text: category,
        callback_data: category 
      } 

      ));

      const inlineKeyboardRows = [];
      for (let i = 0; i < inlineKeyboard.length; i += 2) {
        inlineKeyboardRows.push(inlineKeyboard.slice(i, i + 2));
      }

      return inlineKeyboardRows;
    }

    const inlineKeyboardRows = createInlineKeyboard(data);

    bot.telegram.sendMessage(chatId, 'Pilih kategori produk:', {
      reply_markup: {
        inline_keyboard: inlineKeyboardRows,
        one_time_keyboard: true
      }
    });

  })
  .catch(error => {
    console.error('Error:', error);
    bot.telegram.sendMessage(chatId, 'kesalahan System, Mohon ulangi dalam 5 detik kembali')
  });
})
bot.command('mini', async (ctx) => {
  console.log(ctx.message.chat.id)
  const message = "Halo! Silakan pilih opsi di bawah ini:";


  const keyboard = {
    reply_markup: {
      inline_keyboard: [
      [{ text: "VAaskask", callback_data: 'halo' }],
      ],
      one_time_keyboard: true
    }
  };


  await bot.telegram.sendMessage(ctx.message.chat.id, message, keyboard);
  // ctx.reply('Hello')
})


bot.action('menuPay', async (ctx) => {
  console.log(ctx.update.callback_query.from.id)
  const chatId = ctx.update.callback_query.from.id
  const message = "Halo! Silakan pilih opsi di bawah ini:";

  await bot.telegram.sendMessage(chatId, message, keyboard);
  ctx.deleteMessage()
  // ctx.reply('Hello')
})



bot.action(['E-Money', 'Data', 'Games'], ctx => {
  console.log(ctx.match[0])
  const action = ctx.match[0];
  const chatId = ctx.update.callback_query.from.id
  

  main().then(data => {
    const productsInCategory = data.filter(product => product.category === action);

    // Buat pesan dengan detail produk
    let message = `Detail produk dalam kategori *${action}*: \n\n`;
    productsInCategory.forEach((product, index) => {
      message += `${index + 1}. *${product.product_name}*\n`;
      message += `  Kategori: ${product.category}\n`;
      message += `  Harga: Rp ${product.price}\n`;
      message += `  Kode SKU Pembeli: ${product.buyer_sku_code}\n`;
      message += `  Status Produk Pembeli: ${product.buyer_product_status ? 'Tersedia' : 'Tidak Tersedia'}\n`;
      message += `  Status Produk Penjual: ${product.seller_product_status ? 'Tersedia' : 'Tidak Tersedia'}\n`;
      message += `  Waktu Mulai Cut Off: ${product.start_cut_off}\n\n`;
    });

    // Kirim pesan dengan detail produk ke pengguna
    bot.telegram.sendMessage(chatId, message, { parse_mode: 'Markdown' });
  }).catch(error => {
    console.error('Error:', error);
    bot.telegram.sendMessage(chatId, 'Terjadi kesalahan saat mengambil data produk. ulangi klik dalam 5 detik');
  });
  ctx.deleteMessage()


})

bot.action('halo', ctx => {

  console.log(ctx)
  const chatId = ctx.update.callback_query.from.id

  bot.telegram.sendMessage(chatId, 'Hallo jugaa')
  ctx.deleteMessage()


})

bot.on('callback_query', async (callbackQuery) => {
  const action = await callbackQuery.update.callback_query.data;
  const chatId = await callbackQuery.update.callback_query.from.id

  let responseMessage;

  // Mengecek apakah aksi terdapat dalam konfigurasi
  if (action in actionConfigs) {
    const config = actionConfigs[action];
    try {
      const response = await PaymentGuide(config.id);
      const guide = response.data;
      if (guide) {
        const content = guide.map((guide, index) => {
          let steps = guide.content.map(step => `- ${step}`).join('\n');
          return `*${index + 1}. ${guide.title}*\n${steps}\n`;
        }).join('\n');
        const msg = `${config.message}\n\n${content}`;

        const keyboard = {
          reply_markup: {
            inline_keyboard: [
            [{ text: "Menu Kembali", callback_data: 'menuPay' }]
            ]
          }
        };


        await bot.telegram.sendMessage(chatId, msg, { parse_mode: 'Markdown', ...keyboard });
        await callbackQuery.deleteMessage();

      } else {
        await bot.telegram.sendMessage(chatId, 'Nomor panduan tidak valid.');
      }
    } catch (error) {
      console.error('Error:', error);
      await bot.telegram.sendMessage(chatId, 'Maaf, terjadi kesalahan saat mengambil panduan pembayaran.');
    }
  }

//   if (action == 'E-Money' || 'Data' || 'Games') {
//     main().then(data => {
//       const productsInCategory = data.filter(product => product.category === action);

//     // Buat pesan dengan detail produk
//     let message = `Detail produk dalam kategori *${action}*: \n\n`;
//     productsInCategory.forEach((product, index) => {
//       message += `${index + 1}. *${product.product_name}*\n`;
//       message += `  Kategori: ${product.category}\n`;
//       message += `  Harga: Rp ${product.price}\n`;
//       message += `  Kode SKU Pembeli: ${product.buyer_sku_code}\n`;
//       message += `  Status Produk Pembeli: ${product.buyer_product_status ? 'Tersedia' : 'Tidak Tersedia'}\n`;
//       message += `  Status Produk Penjual: ${product.seller_product_status ? 'Tersedia' : 'Tidak Tersedia'}\n`;
//       message += `  Waktu Mulai Cut Off: ${product.start_cut_off}\n\n`;
//     });

//     // Kirim pesan dengan detail produk ke pengguna
//     bot.telegram.sendMessage(chatId, message, { parse_mode: 'Markdown' });
//   }).catch(error => {
//     console.error('Error:', error);
//     bot.telegram.sendMessage(chatId, 'Terjadi kesalahan saat mengambil data produk. ulangi klik dalam 5 detik');
//   });
// }

});


// Fungsi untuk memecah array menjadi beberapa bagian
function chunkArray(array, size) {
  const result = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
}


bot.help((ctx) => ctx.reply('Send me a sticker'))
bot.on('sticker', (ctx) => ctx.reply('👍'))
bot.hears('hi', (ctx) => ctx.reply('Hey there'))
bot.launch()


