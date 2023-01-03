import {CurrencyRecord} from "../types/currencyRecord";

export interface selectCurrencyProps {
    onChange: Function
    currencyRecords: CurrencyRecord[]
}
export function SelectCurrency({onChange, currencyRecords}: selectCurrencyProps) {
    return(
        <select onChange={(e) => onChange(e.target.value)}>
            <option value={undefined}>select currency</option>
            { currencyRecords.length > 1 &&
                currencyRecords.map(record => {
                    return <option key={record.code} value={record.code}>{record.code} ({record.country})</option>
                })
            }
        </select>
    )
}