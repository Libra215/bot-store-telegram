const TelegramBot = require('node-telegram-bot-api');
const bodyParser = require("body-parser");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const getProfile = require("./Controller/ControllerPayments/GetProfile");
const { PaymentGuide } = require("./Controller/ControllerPayments/PaymentGuide");
const daftarHarga = require("./Controller/ControllerDigi/PriceList");
const express = require('express')
const Digiflazz  = require('digiflazz')
const { Paydisini } = require('@ibnusyawall/paydisini')
require('dotenv').config()


// Inisialisasi bot dengan token
const bot = new TelegramBot(process.env.TOKEN_API, { polling: true });

// Event listener ketika ada pesan 

// bot.command('ping', res => {
//   bot.sendMessage(res.chat.id, 'pong')
// })

async function main() {
  try {

    const harga = await daftarHarga();  
    return harga;
    console.log(harga);
  } catch (error) {
    console.error('Error:', error);
  }
}

bot.onText(/\/echo (.+)/, (msg, match) => {
  // 'msg' is the received Message from Telegram
  // 'match' is the result of executing the regexp above on the text content
  // of the message

  const chatId = msg.chat.id;
  const resp = match[1]; // the captured "whatever"
  console.log(resp)

  // send back the matched "whatever" to the chat
  bot.sendMessage(chatId, resp);
});


bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const messageText = msg.text;
  console.log(msg)

    // Tanggapan sederhana
    if (messageText === '/start') {
      bot.sendMessage(chatId, 'Halo! Saya adalah bot yang siap melayani Anda. Silakan ketikan, "produk" untuk melihat produk');
    }  

    if (messageText.toLowerCase() == 'payments') {
      const chatId = msg.chat.id;
      const message = "Halo! Silakan pilih opsi di bawah ini:";


      const keyboard = {
        reply_markup: {
          inline_keyboard: [
          [{ text: "VA Bank BCA", callback_data: 'bca' }, { text: "VA Bank BRI", callback_data: 'bri' }],
          [{ text: "VA Bank CIMB", callback_data: 'cimb' }, { text: "VA Bank MANDIRI", callback_data: 'mandiri' }],
          [{ text: "VA Bank Maybank", callback_data: 'mybnk' }, { text: "VA Bank Permata", callback_data: 'permata' }],
          [{ text: "VA Bank DANAMON", callback_data: 'danamon' }, { text: "VA Bank BSI", callback_data: 'bsi' }],
          [{ text: "QRIS All Payments", callback_data: 'qris' }, { text: "DANA", callback_data: 'dana' }],
          [{ text: "LINKAJA", callback_data: 'linkaja' }, { text: "SHOPEEPAY", callback_data: 'shopee' }]
          ],
          one_time_keyboard: true
        }
      };


      bot.sendMessage(chatId, message, keyboard);


    }

    if (messageText.toLowerCase() === 'produk11') {

      // function createInlineKeyboard(data) {
      //   const categories = Object.keys(data);
      //   const inlineKeyboard = categories.map(category => ({
      //     text: category,
      //     callback_data: category 
      //   }));
      //   return inlineKeyboard;
      // }

    }

    if (messageText.toLowerCase() == 'saldo') {
      async function cekSaldo() {
        const digiflazz = new Digiflazz(process.env.USER_DIGIFLAZZ, process.env.API_KEY_DIGIFLAZZ);
        try {
          const saldo = await digiflazz.cekSaldo();
          console.log(saldo);
        } catch (error) {
          console.error('Error:', error);
        }
      }
      cekSaldo()
    }

    if (messageText.toLowerCase() == 'produk') {


      main().then(data => {
        function createInlineKeyboard(data) {
          const categories = [...new Set(data.map(product => product.category))];
          const inlineKeyboard = categories.map(category => ({
            text: category,
            callback_data: category 
          } 
          // one_time_keyboard: true
          ));

          const inlineKeyboardRows = [];
          for (let i = 0; i < inlineKeyboard.length; i += 2) {
            inlineKeyboardRows.push(inlineKeyboard.slice(i, i + 2));
          }

          return inlineKeyboardRows;
        }

        const inlineKeyboardRows = createInlineKeyboard(data);
        // msg.deleteMessage()
        bot.sendMessage(chatId, 'Pilih kategori produk:', {
          reply_markup: {
            inline_keyboard: inlineKeyboardRows,
            one_time_keyboard: true
          }
        });


      })
      .catch(error => {
        console.error('Error:', error);
        bot.sendMessage(chatId, 'kesalahan System, Mohon ulangi dalam 5 detik kembali')
      });

    }

    if (messageText.toLowerCase() == 'price') {
      async function daftarHarga() {
        const digiflazz = new Digiflazz(process.env.USER_DIGIFLAZZ, process.env.API_KEY_DIGIFLAZZ);
        try {
          const harga = await digiflazz.daftarHarga();
          const groupedProducts = harga.reduce((acc, product) => {
            acc[product.category] = acc[product.category] || [];
            acc[product.category].push(product);
            return acc;
          }, {});
          console.log(groupedProducts);
          console.log(Object.keys(harga))
          return groupedProducts;
        } catch (error) {
          console.error('Error:', error);
          throw error; 
        }
      }


      daftarHarga()
      .then(data => {
        let responseText = "";
        Object.keys(data).forEach(category => {
          responseText += `*${category}:*\n\n`;
          data[category].forEach(product => {
            responseText += `- Nama Produk: ${product.product_name}\n`;
            responseText += `  Kategori: ${product.category}\n`;
            responseText += `  Harga: Rp ${product.price}\n`;
            responseText += `  Kode SKU Pembeli: ${product.buyer_sku_code}\n`;
            responseText += `  Status Produk Pembeli: ${product.buyer_product_status ? 'Tersedia' : 'Tidak Tersedia'}\n`;
            responseText += `  Status Produk Penjual: ${product.seller_product_status ? 'Tersedia' : 'Tidak Tersedia'}\n`;
            responseText += `  Waktu Mulai Cut Off: ${product.start_cut_off}\n`;
            // responseText += `  Waktu Akhir Cut Off: ${product.end_cut_off}\n`;
            // responseText += `  Deskripsi: ${product.desc}\n\n`;
            
          });
        });

    // Kirim pesan respons ke pengguna
    bot.sendMessage(chatId, responseText);
  })
      .catch(error => {
        console.error('Error:', error);
      });

    }

  });

// Menangani aksi saat tombol ditekan
const actionConfigs = {
  'bca': { id: 1, message: 'Panduan Pembayaran VA Bank BCA' },
  'bri': { id: 2, message: 'Panduan Pembayaran VA Bank BRI' },
  'cimb': { id: 3, message: 'Panduan Pembayaran VA Bank CIMB' },
  'mandiri': { id: 5, message: 'Panduan Pembayaran VA Bank MANDIRI' },
  'mybnk': { id: 6, message: 'Panduan Pembayaran VA Bank Maybank' },
  'permata': { id: 7, message: 'Panduan Pembayaran VA Bank Permata' },
  'danamon': { id: 8, message: 'Panduan Pembayaran VA Bank DANAMON' },
  'bsi': { id: 9, message: 'Panduan Pembayaran VA Bank BSI' },
  'qris': { id: 11, message: 'Panduan Pembayaran QRIS All Payments' },
  'dana': { id: 13, message: 'Panduan Pembayaran Menggunakan DANA' },
  'linkaja': { id: 14, message: 'Panduan Pembayaran Menggunakan LINKAJA'},
  'shopee': { id: 16, message: 'Panduan Pembayaran Menggunakan SHOPEEPAY' }
    // Tambahkan konfigurasi untuk setiap aksi lainnya di sini
  };



// Menangani aksi saat tombol ditekan
// bot.on('callback_query', async (callbackQuery) => {
//   const action = callbackQuery.data;
//   console.log(callbackQuery)
//   const chatId = callbackQuery.message.chat.id;

//     // Menentukan pesan yang akan dikirim berdasarkan aksi
//     let responseMessage;

//     // Mengecek apakah aksi terdapat dalam konfigurasi
//     if (action in actionConfigs) {
//       const config = actionConfigs[action];
//       try {
//         const response = await PaymentGuide(config.id);
//         const guide = response.data;
//         if (guide) {
//           const content = guide.map((guide, index) => {
//             let steps = guide.content.map(step => `- ${step}`).join('\n');
//             return `*${index + 1}. ${guide.title}*\n${steps}\n`;
//           }).join('\n');
//           const msg = `${config.message}\n\n${content}`;
//           // bot.sendMessage(chatId, msg, { parse_mode: 'Markdown' });
//           const keyboard = {
//             reply_markup: {
//               inline_keyboard: [
//               [{ text: "Menu Kembali", callback_data: 'bca' }],
//               // one_time_keyboard: true
//               ]
//             }
//           };


//           bot.sendMessage(chatId, msg, { parse_mode: 'Markdown' }, keyboard);
//         } else {
//           bot.sendMessage(chatId, 'Nomor panduan tidak valid.');
//         }
//       } catch (error) {
//         console.error('Error:', error);
//         bot.sendMessage(chatId, 'Maaf, terjadi kesalahan saat mengambil panduan pembayaran.');
//       }
//     } else {

//       responseMessage = 'Aksi tidak dikenali.';
//       bot.sendMessage(chatId, responseMessage);
//     }

//   });

// Menangani aksi saat tombol kategori produk ditekan
// Handler untuk callback query saat kategori dipilih
bot.on('callback_query', async (callbackQuery) => {
  const category = callbackQuery.data; // Mendapatkan kategori yang dipilih
  const chatId = callbackQuery.message.chat.id; // Mendapatkan ID chat
  
  // Filter data produk berdasarkan kategori yang dipilih
  main().then(data => {
    const productsInCategory = data.filter(product => product.category === category);

    // Buat pesan dengan detail produk
    let message = `Detail produk dalam kategori *${category}*: \n\n`;
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
    bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });
  }).catch(error => {
    console.error('Error:', error);
    bot.sendMessage(chatId, 'Terjadi kesalahan saat mengambil data produk. ulangi klik dalam 5 detik');
  });
});


  // const productsInCategory = data.filter(product => product.category === category);
  
  // // Membuat pesan respons dengan detail produk
  // let responseMessage = '';
  // productsInCategory.forEach(product => {
  //   responseMessage += `*${product.product_name}*\n`;
  //   responseMessage += `Category: ${product.category}\n`;
  //   responseMessage += `Brand: ${product.brand}\n`;
  //   responseMessage += `Type: ${product.type}\n`;
  //   responseMessage += `Price: ${product.price}\n\n`;
  // });

  // // Mengirim pesan respons ke pengguna
  // bot.sendMessage(chatId, responseMessage, { parse_mode: 'Markdown' });




// Menangani aksi saat tombol ditekan
// bot.on('callback_query', async (callbackQuery) => {
//   const category = callbackQuery.data;
//   const chatId = callbackQuery.message.chat.id;

//     // Ambil data produk sesuai kategori yang dipilih
//     const products = jsonData[category];
//     if (products) {
//         // Buat tombol inline untuk setiap produk dalam kategori
//         const buttons = products.map(product => ({
//           text: product.product_name,
//             callback_data: JSON.stringify(product) // Mengirim data produk sebagai callback_data
//           }));

//         console.log('Buttons:', buttons); // Tambahkan log untuk melihat struktur tombol inline

//         // Memecah tombol-tombol menjadi beberapa baris (array dari array)
//         const inlineKeyboard = {
//             inline_keyboard: chunkArray(buttons, 2) // Menggunakan fungsi chunkArray untuk memecah menjadi baris-baris
//           };

//         console.log('Inline keyboard:', inlineKeyboard); // Tambahkan log untuk melihat struktur inline keyboard

//         // Kirim pesan dengan tombol produk
//         bot.sendMessage(chatId, 'Pilih produk:', {
//             reply_markup: inlineKeyboard // Menggunakan inlineKeyboard yang sudah diperbaiki
//           });
//       } else {
//         bot.sendMessage(chatId, 'Data produk tidak tersedia.');
//       }
//     });

// // Fungsi untuk memecah array menjadi beberapa bagian
// function chunkArray(array, size) {
//   const result = [];
//   for (let i = 0; i < array.length; i += size) {
//     result.push(array.slice(i, i + size));
//   }
//   return result;
// }


bot.on('photo', (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'Saya menerima foto, terima kasih!');
});

bot.on('polling_error', (error) => {
  console.error(error);
});

console.log('Bot sedang berjalan...');

const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

async function CallbackStatus(status, unique_code) {
  try {
    // Menunggu hasil dari operasi asynchronous
    const callbackStatus = await client.callbackStatus({status: status, unique_code: unique_code})
    console.log(callbackStatus)
    return callbackStatus // print result
  } catch (error) {

    throw new Error('Gagal mengambil panduan pembayaran: ' + error.message);
  }
}

app.use(bodyParser.urlencoded({ extended: true }));
app.post("/callback", async (req, res) => {
  const data = req.body;

  try {
    // Panggil fungsi CallbackStatus secara asynchronous
    const response = await CallbackStatus(data.status, data.unique_code);
    
    // Lakukan sesuatu dengan respons jika diperlukan
    console.log(response);

    // Berikan respons berhasil jika tidak ada kesalahan
    res.json({ success: true });
  } catch (error) {
    // Tangani kesalahan dengan memberikan respons gagal
    console.error('Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }

  // Menggunakan fungsi connectToWhatsapp dari server.js
  // Hanya panggil sekali dengan data status
  // if (data.status) {
  //   connectToWhatsapp(data.status);
  // }

  // CallbackStatus.checkData(data, (success) => {
  //   if (success) {
  //     res.json({ success: true });
  //   } else {
  //     res.json({ success: false, message: "Data do not match!" });
  //   }
  // });
});