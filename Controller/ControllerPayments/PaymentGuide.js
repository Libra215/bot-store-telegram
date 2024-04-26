const { Paydisini } = require('@ibnusyawall/paydisini')
require('dotenv').config()


config = {
	token: process.env.TOKEN_API,
	api_pay: process.env.API_KEY_PAYDISINI
  // api_digi: process.env.API_KEY_DIGIFLAZZ
}

const client = new Paydisini(config.api_pay)

async function PaymentGuide(req) {
	try {
        // Menunggu hasil dari operasi asynchronous
        const paymentGuide = await client.paymentGuide({ service: req });
        return paymentGuide; // Mengembalikan respons dari panggilan client.paymentGuide()
    } catch (error) {
        // Tangani kesalahan jika ada
        throw new Error('Gagal mengambil panduan pembayaran: ' + error.message);
    }
}

module.exports = { PaymentGuide }