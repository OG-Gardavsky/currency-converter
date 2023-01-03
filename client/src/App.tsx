import {useEffect, useState} from 'react'
import './App.css'
import axios from "axios";
import {CurrencyRecord} from "./types/currencyRecord";

const parseData = (data: any): CurrencyRecord[] => {
    const lines = data.split(/\r\n|\r|\n/g);
    lines.shift()

    const keys = lines[0].split('|')
    const lowerCaseKeys = keys.map((key: string) => key.toLowerCase())
    lines.shift()


    const currencyRecords: Array<CurrencyRecord> = []
    lines.forEach((line: any) => {
        const currencyData = line.split('|')
        if(currencyData.length < 2) return

        const records: CurrencyRecord = {country: '', currency: '', rate: 0, code: '', amount: 0}

        currencyData.forEach((record: string | number, index: number) => {
            if(lowerCaseKeys[index] === 'amount' || lowerCaseKeys[index] === 'rate') {
                record = Number(record)
            }
            //@ts-ignore
            records[lowerCaseKeys[index]] = record
        })
        currencyRecords.push(records)
    })

    return currencyRecords
}

const createCurrencyString = ({amount, code, country, rate}: any) => `${amount} ${code}(${country}) = ${rate} CZK`


function App() {
    const URL = 'http://localhost:3000/records'


    const [currencyRecords, setCurrencyRecords] = useState<CurrencyRecord[]>([])
    const [error, setError] = useState('')
    const [selectedCurrency, setSelectedCurrency] = useState('')
    const [conversionString, setConversionString] = useState('')

    useEffect(() => {
        axios.get(URL)
            .then((result) => {
                const records = parseData(result.data)
                setCurrencyRecords(records)
                console.log(records);
            })
            .catch((err) => {
                console.log(err)
                setError('Error during data load')
            })

    }, [])

    function handleSubmit(e: any) {
        e.preventDefault()

        const ammount = e.target[0].value
        if(currencyRecords.length < 1 || !ammount) return

        const foundObj = currencyRecords.find(record => record.code === selectedCurrency)
        if(!foundObj) return
        const num = (ammount / (foundObj.rate / foundObj.amount)).toFixed(2)

        setConversionString(`${ammount} CZK = ${num} ${foundObj.code} (${foundObj.country})`)
    }


    return (
        <div className="App">
            <h1>Currency converter</h1>
            <form onSubmit={handleSubmit}>
                <input type="number" />
                <button type="submit">count</button>
            </form>

            {
                <select onChange={(e) => setSelectedCurrency(e.target.value)}>
                    <option value={undefined}>select currency</option>
                    { currencyRecords.length > 1 &&
                        currencyRecords.map(record => {
                           return <option key={record.code} value={record.code}>{record.code} ({record.country})</option>
                        })
                    }
                </select>
            }

            <h2>{conversionString}</h2>


            {
                currencyRecords.length < 1 && !error
                ? 'loading...'
                : currencyRecords.map((record) => {
                        return <li key={record.code}>{ createCurrencyString(record) }</li>
                    })
            }

            {error && <h2>{ error }</h2>}
        </div>
    )
}

export default App
