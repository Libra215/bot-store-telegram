const axios = require('axios');
const crypto = require('crypto');
require('dotenv').config();


const config = {
	apikey: process.env.API_KEY_PAYDISINI,
	baseUrl: process.env.URL_PAYDISINI
};

function generateSign(apikey, cmd) {
	const sign = crypto.createHash('md5').update(apikey + cmd).digest("hex");
	return sign;
}

async function getProfile() {
	const sign = generateSign(config.apikey, 'Profile');
	try {
		const response = await axios.post(config.baseUrl, {
			key: config.apikey,
			request: 'profile',
			signature: sign
		}, {
			headers: {
				'Content-Type': 'multipart/form-data'
			}
		});
		console.log(response.data)
		return response.data;
	} catch (error) {
		throw error;
	}
}

// getProfile();
module.exports = getProfile;
