//Dependencies.
const { Client } = require('discord.js');
const dotenv = require('dotenv');
const axios = require('axios').default;
const contractAddress = "0xEF2ec90e0b8D4CdFdB090989EA1Bc663F0D680BF"; //SAFEMOON Contract Address

//Load Environment
dotenv.config();
console.log(process.env.DISCORD_TOKEN);

//Create an instance of client
const client = new Client();

//Login
client.login(process.env.DISCORD_TOKEN);
client.on('ready', () => {
    console.log(client.user.tag + ' has logged in.');
});

/**
 * Function for obtaining data from Dex.Guru's API.
 * @returns Dex.Guru's API data
 */
async function getApi() {
    try {
        let response = await axios.get('https://api.dex.guru/v1/tokens/' + contractAddress + '-bsc/');
        return response.data;
    } catch (err) {
        console.log(err);
        return "Failed";
    }
}

/**
 * Function for obtaining the total burned supply from BSCSCAN.
 * @returns total Burned Supply to-date.
 */
/* async function getBurnedTotal() {
    try {
        let response = await axios.get('https://api.bscscan.com/api?module=account&action=tokenbalance&contractaddress=0x8076C74C5e3F5852037F31Ff0093Eeb8c8ADd8D3&address=0x0000000000000000000000000000000000000001&tag=latest&apikey=YOUR_API_KEY_GOES_HERE');
        let value = response.data['result'];
        value = (value / 1_000_000_000_000_000_000_000).toFixed(4);
        console.log(value);
        return value;
    } catch (err) {
        console.log(err);
        return "Failed";
    }
} */

/**
 * Function for obtaining data from CoinMarketCap's Api.
 * @returns CoinMarketCap's widget API json data
 */
/* async function getCMCData() {
    try {
        let response = await axios.get('https://3rdparty-apis.coinmarketcap.com/v1/cryptocurrency/widget?id=8757');
        return response.data;
    } catch (err) {
        console.log(err);
        return "Failed"
    }
} */

/**
 * Function for sending the stand-alone price every 20 seconds.
 */
setInterval(async function () {
    try {
        let dexGuruData = await getApi();
        let price = dexGuruData['priceUSD'];
        price *= Math.pow(10, 10);
        let channel = client.channels.cache.get('828264810327441450'); //Change this to your Channel Id
        channel.send(price.toPrecision(6));
    } catch (err) {
        console.log(err);
        return "Failed";
    }
}, 20 * 1000);

/**
 * Function for sending the Embedded price display every 5 minutes.
 */
setInterval(async function () {
    try {
        let dexGuruData = await getApi();
        let price = dexGuruData['priceUSD'].toFixed(dexGuruData['decimals']);
        let volume = (dexGuruData['volume24hUSD'] / 1_000_000).toFixed(4);
        let channel = client.channels.cache.get('828264810327441450');

        // let burnTotal = await getBurnedTotal();
        let timeStamp = Date.now();

        /* let cmcData = await getCMCData();
        let cmcBase = cmcData.data[8757];
        let cmcQuote = cmcBase['quote']['USD'];
        let total_supply = cmcBase['total_supply'];
        let marketCap = ((total_supply * price) / 1_000_000).toFixed(4); */

        /* let change1h = cmcQuote['percent_change_1h'].toFixed(4);
        let change24h = cmcQuote['percent_change_24h'].toFixed(4);
        let change7d = cmcQuote['percent_change_7d'].toFixed(4); */

        channel.send({
            embed: {
                "title": "**" + contractAddress + "**",
                "description": "This bot will automatically post new stats every minute.",
                "url": "https://bscscan.com/address/" + contractAddress,
                "color": 2029249,
                "timestamp": timeStamp,
                "footer": {
                    "text": "Orfano Price Bot - Values based on USD."
                },
                "thumbnail": {
                    "url": "https://uploads-ssl.webflow.com/6064fa58ec97b31efb0005cd/6069c7e204473011913ba995_logo-final%203.png"
                },
                "author": {
                    "name": "Orfano Price Bot",
                    "url": "https://orfano.io"
                },
                "fields": [
                    {
                        "name": "💸 Price",
                        "value": "$" + price,
                        "inline": true
                    },
                    {
                        "name": "🧊 Volume",
                        "value": "$" + volume + "M",
                        "inline": true
                    }
                ]
            }
        });
    } catch (err) {
        console.log(err);
    }
}, 30 * 1000); //(x * 1000) this will post in the designated channel every 'x' seconds.