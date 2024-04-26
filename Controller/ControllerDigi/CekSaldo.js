const axios = require('axios');
const crypto = require('crypto');
const Digiflazz  = require('digiflazz')
require('dotenv').config()

const config = {
	username: process.env.USER_DIGIFLAZZ,
	apikey: process.env.API_KEY_DIGIFLAZZ,
	baseUrl: process.env.URL_DIGIFLAZZ,
};

// async function cekSaldo() {
// 	const digiflazz = new Digiflazz('kobigoDA2zbW', 'dev-6cbaddb0-43ce-11ee-8f80-dd5b3b78b44b');

// 	try {
// 		let saldo = await digiflazz.cekSaldo();
// 		console.log(saldo);
// 	} catch (error) {
// 		console.error('Error:', error);
// 	}
// }

// cekSaldo()
// module.exports = cekSaldo;
// Panggil fungsi cekSaldo untuk mengeksekusi kode
// cekSaldo();


// // Fungsi untuk menghitung md5 hash dari sebuah string
// function calculateMD5(string) {
// 	return crypto.createHash('md5').update(string).digest('hex');
// }


// // Menggabungkan username, apiKey, dan string "depo"
// const concatenatedString = config.username + config.apiKey + "depo";

// // Menghitung md5 hash dari hasil penggabungan
// // const sign = calculateMD5(concatenatedString);

// // Struktur JSON untuk request
// const requestData = {
// 	"cmd": 'deposit',
// 	"username": config.username,
// 	"sign": calculateMD5(concatenatedString);
// };

// // Melakukan request menggunakan axios
// axios.post('URL_API_ANDA', requestData)
// .then(response => {
// 	console.log('Response:', response.data);
// })
// .catch(error => {
// 	console.error('Error:', error);
// });
