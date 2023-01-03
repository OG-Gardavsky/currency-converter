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

const createCurrencyString = ({amount, code, country, rate}: any) => `${amount} ${code}(${country}) = ${rate} CZK`


function App() {
    const URL = 'http://localhost:3000/records'


    const [currencyRecords, setCurrencyRecords] = useState([])
    const [error, setError] = useState('')
    const [selectedCurrency, setSelectedCurrency] = useState('')
    const [conversionString, setConversionString] = useState('')

    useEffect(() => {
        axios.get(URL)
            .then((result) => {
                const records = parseData(result.data)
                //@ts-ignore
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
                        // @ts-ignore
                        return <li key={record.code}>{ createCurrencyString(record) }</li>
                    })
            }

            {error && <h2>{ error }</h2>}
        </div>
    )
}

export default App
