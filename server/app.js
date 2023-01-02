const express = require('express')
const path = require('path')
const axios = require("axios")

const app = express()

app.get('/records', async (req, res) => {
     try {
          const URL = 'https://www.cnb.cz/en/financial-markets/foreign-exchange-market/central-bank-exchange-rate-fixing/central-bank-exchange-rate-fixing/daily.txt'
          const rawdata = await axios.get(URL)
          const data = rawdata.data
          
          res.header('Access-Control-Allow-Origin', '*')
          res.send(data)

     } catch (error) {
          res.status(500).send({error: 'unable to retrieve currency data'})
     }
     
})

app.use(express.static(path.resolve(__dirname, '../client/dist')));

app.get('*', function (req, res) {
     response.sendFile(path.resolve(__dirname, '../client/dist', 'index.html'));
});

app.listen(3000, () => {
     console.log('running od port 3000')
})