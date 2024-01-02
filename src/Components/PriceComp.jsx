import { Button, Form, Input, InputNumber, Space } from 'antd'
import React, { useState } from 'react'
import styled from 'styled-components'
import { useBillContext } from '../Context/Bill_Context'
import { useStepContext } from '../Context/Step_Context'

function round(n) {
    return n + (10 - n % 10);
}

function calc(gram, rate, labour, extra) {
    gram=parseFloat(gram);
    labour=parseFloat(labour);
    rate=parseFloat(rate);
    extra=parseFloat(extra);
    let amount = ((gram * (rate + labour)) + extra);
    return round(amount + amount * 0.03);
}

const PriceComp = () => {
    const { billData, setBillData } = useBillContext();
    const { step, handleOnPrevious, handleOnNext, maxStepLimit } = useStepContext();
    const [form] = Form.useForm();
    const gram = Form.useWatch('productweight',form);
    const labour = Form.useWatch('labour',form);
    const rate = Form.useWatch('rate',form);
    const extra = Form.useWatch('extra',form);
    let finalPrice = calc(gram, rate, labour, extra);

    const handleOnSubmit = (val) => {
        setBillData({...billData,...val,purchaseprice:finalPrice,rate:rate});
        handleOnNext();
    }
    const onEnter = e => {
        //it triggers by pressing the enter key
        if (e.which === 13) {
            form.submit();
        }
    };

    return (
        <Price_Container>
            <h1>Enter weight and labour of product</h1>
            <div className='Price_Container'>
                <Button type='primary' onClick={handleOnPrevious} disabled={!(step > 1)} >Previous</Button>
                <Form
                    initialValues={{labour:billData['labour'],rate:billData['rate'],extra:0 }}
                    form={form}
                    onKeyDown={onEnter}
                    onFinish={handleOnSubmit}
                    labelWrap
                >
                    <div className='form_elements' >
                        <Form.Item
                            label={'Weight'}
                            name={'productweight'}
                            rules={[
                                {
                                    required: true,
                                    message: "Weight is required !"
                                },
                                {
                                    validator(_, val) {
                                        if (!val) {
                                            return Promise.reject(new Error('Plz enter valid weight'));
                                        }
                                        else if (val > 100) {
                                            return Promise.reject(new Error(`Weight is greater than ${100}`));
                                        }
                                        else if (val < 1) {
                                            return Promise.reject(new Error(`Weight should be more than 0`));
                                        }
                                        else {
                                            return Promise.resolve();
                                        }
                                    }
                                },
                            ]}
                        >
                            <InputNumber addonAfter={'g'} autoFocus name='productweight' type='number' />
                        </Form.Item>
                        <Form.Item
                            label={'Labour'}
                            name={'labour'}
                            rules={[
                                {
                                    required: true,
                                    message: "Labour is required !"
                                },
                                {
                                    validator(_, val) {
                                        if (!val) {
                                            return Promise.reject(new Error('Plz enter valid labour cost'));
                                        }
                                        else if (val < 1) {
                                            return Promise.reject(new Error(`Labour Cost should be more than 0`));
                                        }
                                        else {
                                            return Promise.resolve();
                                        }
                                    }
                                },
                            ]}
                        >
                            <InputNumber name='labour' type='number' addonAfter='Rs/g' />
                        </Form.Item>
                        <Form.Item
                            label={'Rate'}
                            name={'rate'}
                            rules={[
                                {
                                    required: true,
                                    message: "Rate is required !"
                                },
                                {
                                    validator(_, val) {
                                        if (!val) {
                                            return Promise.reject(new Error('Plz enter valid rate'));
                                        }
                                        else if (val < 1) {
                                            return Promise.reject(new Error(`Rate should be more than 0`));
                                        }
                                        else {
                                            return Promise.resolve();
                                        }
                                    }
                                },
                            ]}
                        >
                            <InputNumber name='rate' type='number' addonAfter='Rs' />
                        </Form.Item>
                        <Form.Item
                            label={'Extra'}
                            name={'extra'}
                            rules={[
                                {
                                    required: true,
                                    message: "Extra is required !"
                                },
                                {
                                    validator(_, val) {
                                        if (val===NaN) {
                                            return Promise.reject(new Error('Plz enter valid extra amount'));
                                        }
                                        else if (val < 0) {
                                            return Promise.reject(new Error(`Extra amount should not be negative`));
                                        }
                                        else {
                                            return Promise.resolve();
                                        }
                                    }
                                },
                            ]}
                        >
                            <InputNumber name='extra' type='number' addonAfter='Rs' />
                        </Form.Item>
                        <p style={{paddingTop:"5px"}}>Total Amount : {finalPrice||0}</p>
                    </div>
                </Form>
                <Button type='primary' disabled={!(step <= maxStepLimit)}>Next</Button>
            </div>
        </Price_Container>
    )
}

export default PriceComp;

const Price_Container = styled.div`
    text-align:center;
    .form_elements{
        display:flex;
        justify-content:space-evenly;
        // flex-wrap: wrap;
        gap:1rem;
        input{
            width:80px;
        }
    }
    .Price_Container {  
        display: grid;
        grid-template-columns: 0.2fr 2fr 0.2fr;
        grid-template-rows: 1fr;
        gap: 0px 1rem;
        grid-auto-flow: row;
        grid-template-areas:
        ". . .";
    }

    @media only screen and (max-device-width: 480px) {
        .form_elements{
            flex-direction:column;
        }
    }
`;