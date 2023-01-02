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

const createCurrencyString = ({amount, currency, country, rate}: any) => `${amount} ${currency}(${country}) = ${rate} CZK`


function App() {
    const URL = 'http://localhost:3000/records'


    const [currencyRecords, setCurrencyRecords] = useState([])
    const [error, setError] = useState('')

    useEffect(() => {
        const config = {
            // headers: {
            //     'Referrer-Policy': 'no-referrer-when-downgrade',
            // },
        }
        axios.get(URL, config)
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
        console.log(e.target[0].value)
    }


    return (
        <div className="App">
            <h1>Currency converter</h1>
            <form onSubmit={handleSubmit}>
                <input type="text" />
                <button type="submit">count</button>
            </form>

            {/*{*/}
            {/*    // currencyRecords.length > 1 ??*/}
            {/*    <select onChange={(e) => console.log(e)}>*/}
            {/*        {currencyRecords.map(record => <option key={record.code}>{record.code}</option>)}*/}
            {/*    </select>*/}
            {/*}*/}

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
