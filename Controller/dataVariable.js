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

};

module.exports = { keyboard, actionConfigs };