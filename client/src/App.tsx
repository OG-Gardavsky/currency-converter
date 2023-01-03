import {useEffect, useRef, useState} from 'react'
import './App.css'
import axios from "axios";
import {CurrencyRecord} from "./types/currencyRecord";
import {CurrencyList} from "./components/currencyList";
import {CurrencyForm} from "./components/currencyForm";

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




function App() {
    const URL = 'http://localhost:3000/records'


    const [currencyRecords, setCurrencyRecords] = useState<CurrencyRecord[]>([])
    const [error, setError] = useState('')
    // const [selectedCurrency, setSelectedCurrency] = useState('')
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

        const selectedCurrency = e.target[1].value
        const ammount = e.target[0].value
        if(currencyRecords.length < 1 || !ammount || !selectedCurrency) return

        const foundObj = currencyRecords.find(record => record.code === selectedCurrency)
        if(!foundObj) return
        const num = (ammount / (foundObj.rate / foundObj.amount)).toFixed(2)

        setConversionString(`${ammount} CZK = ${num} ${foundObj.code} (${foundObj.country})`)
    }


    return (
        <div className="App">
            <h1>Currency converter</h1>

            <CurrencyForm handleSubmit={handleSubmit} currencyRecords={currencyRecords} />

            <h2>{conversionString}</h2>

            { currencyRecords.length < 1 && !error
                ? 'loading...'
                : <CurrencyList  currencyRecords={currencyRecords}/>
            }

            {error && <h2>{ error }</h2>}
        </div>
    )
}

export default App
