import {useEffect, useState} from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import axios from "axios";

const parseData = (data: any) => {
    const lines = data.split(/\r\n|\r|\n/g);
    lines.shift()

    const keys = lines[0].split('|')
    //@ts-ignore
    const lowerCaseKeys = keys.map((key) => key.toLowerCase())
    lines.shift()

    //@ts-ignore
    const currencyRecords = []
    //@ts-ignore
    lines.forEach((line) => {
        const currencyData = line.split('|')
        if(currencyData.length < 2) return

        const records = {}
        //@ts-ignore
        currencyData.forEach((record, index) => {
            //@ts-ignore
            records[lowerCaseKeys[index]] = record
        })
        currencyRecords.push(records)
    })
    //@ts-ignore
    return currencyRecords
}

function App() {
    const URL = 'http://localhost:3000/records'
    // const URL =  ' https://www.cnb.cz/en/financial-markets/foreign-exchange-market/central-bank-exchange-rate-fixing/central-bank-exchange-rate-fixing/daily.txt'


    const [currencyRecords, setCurrencyRecords] = useState([])

    useEffect(() => {

        axios.get(URL)
            .then((result) => {
                const records = parseData(result.data)
                //@ts-ignore
                setCurrencyRecords(records)
                console.log(records);
            })
            .catch((err) => console.log(err))
    }, [])


    return (
        <div className="App">
            <h1>Currency converter</h1>
            { currencyRecords.length < 1
            ? 'loading...'
            : currencyRecords.map((record) => {
                    // @ts-ignore
                    return <li key={record.code}>{ `${record.amount} ${record.currency}(${record.country}) = ${record.rate} CZK` }</li>
                })
            }
        </div>
    )
}

export default App
