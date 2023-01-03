import {CurrencyRecord} from "../types/currencyRecord";
import {Table} from "react-bootstrap";

const createCurrencyString = ({amount, code, country, rate}: any) => `${amount} ${code}(${country}) = ${rate} CZK`

export interface currencyListProps {
    currencyRecords: CurrencyRecord[]
}

export function CurrencyList({currencyRecords}: currencyListProps) {
    return(
        <Table striped bordered hover>
            <thead>
            <tr>
                <th>Currency</th>
                <th>amount</th>
                <th>in CZK</th>
            </tr>
            </thead>
            <tbody>
            {
                currencyRecords.map(({amount, code, country, rate}) => {
                    return (
                        <tr key={code}>
                            <td>{code} ({country}) </td>
                            <td>{amount}</td>
                            <td>{rate}</td>
                        </tr>
                    )
                })
            }

                </tbody>
        </Table>

    )
}