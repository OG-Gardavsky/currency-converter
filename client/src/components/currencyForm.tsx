import {CurrencyRecord} from "../types/currencyRecord";
import {Button, Form, InputGroup} from "react-bootstrap";

export interface selectCurrencyProps {
    handleSubmit: Function | undefined
    currencyRecords: CurrencyRecord[]
    disabled: boolean
}
export function CurrencyForm({handleSubmit, currencyRecords,  disabled}: selectCurrencyProps) {

    return(
        <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                <InputGroup className="mb-3">
                    <InputGroup.Text  id="basic-addon1">CZK</InputGroup.Text>
                    <Form.Control
                        placeholder="Amount in CZK"
                        aria-label="amount"
                        type="number"
                        disabled={disabled}
                    />
                    <Form.Select disabled={disabled}>
                        <option value={undefined}>select currency</option>
                        {currencyRecords.length > 1 &&
                            currencyRecords.map(record => {
                                return <option key={record.code}
                                               value={record.code}>{record.code} ({record.country})</option>
                            })
                        }
                    </Form.Select>
                    <Button variant="secondary" type="submit">convert</Button>
                </InputGroup>
            </Form.Group>
        </Form>
    )
}