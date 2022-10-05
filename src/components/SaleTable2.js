import React, { Component } from 'react';
import { Button, Inputs, Row, Col } from "adminlte-2-react";
import Storage from "../commons/Storage";
import Utils from "../commons/Utils";
import { v4 as uuid } from 'uuid';

const { Text, Select2 } = Inputs;

class SaleTable2 extends Component {
    render() {
        let isdisabled = false;
        const {
            details, handleAddItem, handleDelItem, handleChange, currency, textareaenable, invoicerestric, listProducts
        } = this.props;
        const thead = !invoicerestric ?
            <tr>
                <th style={{ width: 80 }} className={'text-left'}>Acción</th>
                <th style={{ width: 200 }} className={'text-left'}>Tipo</th>
                <th style={{ width: 200 }} className={'text-left'}>Codigo</th>
                <th style={{ width: 500 }} className={'text-left'}>Descripcion</th>
                <th style={{ width: 100 }} className={'text-left'}>Cantidad</th>
                <th style={{ width: 150 }} className={'text-right'}>Precio Unitario</th>
                <th style={{ width: 150 }} className={'text-right'}>Precio total</th>
            </tr> :
            <tr>
                <th style={{ width: 80 }} className={'text-left'}>Acción</th>
                <th style={{ width: 150 }} className={'text-left'}>Cantidad</th>
                <th style={{ width: 300 }} className={'text-left'}>Unidad de medida</th>
                <th style={{ width: 150 }} className={'text-left'}>Código</th>
                <th style={{ width: 300 }} className={'text-left'}>Descripción del producto</th>
                <th style={{ width: 150 }} className={'text-right'}>Precio unitario</th>
                <th style={{ width: 150 }} className={'text-right'}>Valor venta</th>
            </tr>

        const getTypeFindByProduct = (product) => {
            return Storage.getSuppliesCodePerId(product).category || '';
        }
        const enabletextarea = textareaenable ?
            <><Text
                inputType={'textarea'}
                label={'Descripcion'}
                labelPosition={'above'}
            /></>
            : null;

        const tbodyquote = details ? details.map((detail, idx) => {
            const textArea = document.querySelector("textarea");
            const textRowCount = textArea ? textArea.value.split("\n").length : 0;
            let rows = detail.description ? textRowCount : 1;
            let rowcount = textArea ? textArea.value.length : 0
            let c = 57
            if (rowcount > c) {
                rows++
                c = c + 57
            }

            let products = [];
            if (detail.category != null) {
                products = Storage.findProductPerCategory(detail.category);
            }
            isdisabled = false;
            detail.idx = detail.idx ? detail.idx : uuid();
            return (
                <tr key={idx}>
                    <td>
                        <Button
                            icon={'fa-trash'}
                            type={'danger'}
                            onClick={() => handleDelItem(detail.idx)}
                        />
                    </td>
                    <td>
                        <Select2
                            name={'category-' + idx}
                            labelPosition={'none'}
                            options={[
                                { value: 'Servicio Pintura', label: 'SERVICIO PINTURA' },
                                { value: 'Servicio Carroceria', label: 'SERVICIO CARROCERIA' },
                                { value: 'Servicio Lavado', label: 'SERVICIO LAVADO' },
                                { value: 'Servicio Mecanica', label: 'SERVICIO MECANICA' },
                                { value: 'Repuesto', label: 'REPUESTOS' }
                            ]}
                            value={detail.category ? detail.category : getTypeFindByProduct(detail.product_id)}
                            onChange={handleChange}
                            disabled={detail.product}
                        />
                    </td>
                    <td>
                        <Select2
                            name={'product_id-' + idx}
                            value={[detail.product_id]}
                            options={products}
                            labelPosition={'none'}
                            select2Options={
                                { templateSelection: function(data) { return data.text.split("-")[0] } }
                            }
                            onChange={handleChange}
                        />
                    </td>
                    <td>
                        <Text
                            inputType={'textarea'}
                            name={'description-' + idx}
                            value={detail.description}
                            labelPosition={'none'}
                            onChange={handleChange}
                            disabled={isdisabled}
                            rows={rows}

                        />
                    </td>
                    <td>
                        <Text
                            name={'quantity-' + idx}
                            value={detail.quantity}
                            inputType={'number'}
                            labelPosition={'none'}
                            onChange={handleChange}
                        />
                    </td>
                    <td>
                        <Text
                            name={'rate-' + idx}
                            value={detail.rate}
                            inputType={'number'}
                            labelPosition={'none'}
                            onChange={handleChange}
                        />
                    </td>
                    <td className={'text-right'}>
                        {Utils.formatCurrency(detail.amount, currency)}
                    </td>
                </tr>
            )
        }) : null;
        const tbodyinvoice = details ? details.map((detail, idx) => {
            isdisabled = invoicerestric;
            detail.idx = detail.idx ? detail.idx : uuid();
            return (
                <tr key={idx}>
                    <td>
                        <Button
                            icon={'fa-trash'}
                            type={'danger'}
                            onClick={() => handleDelItem(detail.idx)}
                            disabled={isdisabled}
                        />
                    </td>
                    <td>
                        <Text
                            name={'quantity-' + idx}
                            value={detail.quantity}
                            inputType={'number'}
                            labelPosition={'none'}
                            onChange={handleChange}
                            disabled={isdisabled}
                        />
                    </td>
                    <td>
                        <Text
                            name={'measurement-' + idx}
                            value={detail.measurement}
                            labelPosition={'none'}
                            onChange={handleChange}
                            disabled={isdisabled}
                        />
                    </td>
                    <td>
                        <Text
                            name={'code-' + idx}
                            value={detail.code}
                            labelPosition={'none'}
                            onChange={handleChange}
                            disabled={isdisabled}
                        />
                    </td>
                    <td>
                        <Select2
                            name={'product_id-' + idx}
                            value={detail.product}
                            options={listProducts}
                            labelPosition={'none'}
                            onChange={handleChange}
                            disabled={isdisabled}
                        />
                    </td>
                    <td>
                        <Text
                            name={'rate-' + idx}
                            value={detail.rate}
                            inputType={'number'}
                            labelPosition={'none'}
                            onChange={handleChange}
                            disabled={isdisabled}
                        />
                    </td>
                    <td className={'text-right'}>
                        {Utils.formatCurrency(detail.amount, currency)}
                    </td>
                </tr>
            )
        }) : null;
        const tbody = !invoicerestric ? tbodyquote : tbodyinvoice
        const totalPrice = details ? details.reduce((a, b) => a + (b.amount), 0) : 0;
        const igv = totalPrice * 0.18;
        const total = totalPrice + igv;
        return (<div>
            <Row>
                <Col xs={2}>
                    <Select2
                        name={'currency'}
                        options={[{ value: 'PEN', label: 'SOLES' }, { value: 'USD', label: 'DOLARES' }]}
                        labelPosition={'none'}
                        onChange={handleChange}
                        value={[currency]}
                    />
                </Col>
                <Col xs={8} />
                <Col xs={2}>
                    <Button
                        icon={'fa-plus'}
                        text={'Agregar'}
                        type={'danger'}
                        onClick={handleAddItem}
                        pullRight
                        disabled={invoicerestric}
                    />
                </Col>
            </Row>
            {enabletextarea}
            <div className={'table-responsive'}>
                <table className={'table'}>
                    <thead>
                        {thead}
                    </thead>
                    <tbody>
                        {tbody}
                        <tr>
                            {!invoicerestric ? <th rowSpan={3} colSpan={5} /> : <th rowSpan={3} colSpan={5} />}
                            <th>Valor de venta</th>
                            <td className={'text-right'}>{
                                Utils.formatCurrency(totalPrice, currency)
                            }</td>
                        </tr>
                        <tr>
                            <th>IGV</th>
                            <td className={'text-right'}>{
                                Utils.formatCurrency(igv, currency)
                            }</td>
                        </tr>
                        <tr>
                            <th>Total</th>
                            <td className={'text-right'}>{
                                Utils.formatCurrency(total, currency)
                            }</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>);
    }
}

export default SaleTable2;
