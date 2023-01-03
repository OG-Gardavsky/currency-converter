import {CurrencyRecord} from "../types/currencyRecord";

const createCurrencyString = ({amount, code, country, rate}: any) => `${amount} ${code}(${country}) = ${rate} CZK`

export interface currencyListProps {
    currencyRecords: CurrencyRecord[]
}

export function CurrencyList({currencyRecords}: currencyListProps) {
    return(
        <ul>
            {
                currencyRecords.map((record) => {
                    return <li key={record.code}>{ createCurrencyString(record) }</li>
                })
            }
        </ul>
    )
}