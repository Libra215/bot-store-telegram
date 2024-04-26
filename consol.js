const { Paydisini } = require('@ibnusyawall/paydisini')
require('dotenv').config()


const client = new Paydisini(process.env.API_KEY_PAYDISINI)






async function CreateTransaction() {
    // Menunggu hasil dari operasi asynchronous
    const CreateTransaction = await client.createTransaction({
    	amount: 100,
    	ewallet_phone: '085812486745',
    	note: 'pembelian PS Store',
    	service: 11,
    	type_fee: 2,
    	unique_code: 'ORDER3241',
    	valid_time: 300
    })
    console.log(CreateTransaction) // print result
}
CreateTransaction()






async function PaymentGuide() {
    // Menunggu hasil dari operasi asynchronous
    const paymentGuide = await client.paymentGuide({service: 5})
    console.log(paymentGuide) // print result
}
// PaymentGuide()