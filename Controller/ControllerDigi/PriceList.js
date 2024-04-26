const axios = require("axios");
const crypto = require("crypto");
const Digiflazz  = require('digiflazz')
require('dotenv').config()


const config = {
  username: process.env.USER_DIGIFLAZZ,
  apikey: process.env.API_KEY_DIGIFLAZZ,
  baseUrl: 'https://api.digiflazz.com/v1/',
};

// function generateSign(username, apikey, endpoint) {
//   const sign = crypto
//   .createHash("md5")
//   .update(username + apikey + endpoint)
//   .digest("hex");
//   return sign;
// }

// async function getPriceList() {
//   const endpoint = "/price-list";
//   const sign = generateSign(config.username, config.apikey, endpoint);
//   try {
//     const response = await axios.post(config.baseUrl + endpoint, {
//       cmd: "prepaid",
//       username: config.username,
//       sign: sign,
//     });
//     const groupedProducts = response.data.data.reduce((acc, product) => {
//       acc[product.category] = acc[product.category] || [];
//       acc[product.category].push(product);
//       return acc;
//     }, {});
//     console.log(groupedProducts);
//     return groupedProducts;
//   } catch (error) {
//     throw error;
//   }
// }
// console.log(getPriceList();

async function daftarHarga() {
  const digiflazz = new Digiflazz(config.username, config.apikey);
  try {
    const harga = await digiflazz.daftarHarga();
    const groupedProducts = harga.reduce((acc, product) => {
      acc[product.category] = acc[product.category] || [];
      acc[product.category].push(product);
      return acc;
    }, {});
    console.log(groupedProducts);
          // console.log(Object.keys(harga))
          return harga;
        } catch (error) {
          console.error('Error:', error);
          throw error; 
        }
      }

      // daftarHarga()
// console.log(config.apikey)
module.exports = daftarHarga;
