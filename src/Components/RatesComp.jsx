import { Form, InputNumber } from 'antd';
import React, { useEffect, useState } from 'react'
import styled from 'styled-components';
import { useRateContext } from '../Context/RatesContext';

const RatesComp = () => {
    const { rates, setRates } = useRateContext();
    const [form] = Form.useForm();
    let initalvalues = {
        labour:rates['labour'],
        gold_24:rates['gold_24'],
        gold_22:rates['gold_22'],
        gold_18:rates['gold_18'],
        silver_100:rates['silver_100'],
    }
    const handleOnSubmit = (val)=>{
        setRates({...rates,...val})
    }
    const onEnter = e => {
        //it triggers by pressing the enter key
        if (e.which === 13) {
            form.submit();
        }
    };
    return (
        <Rates_Container>
            <Form
                form={form}
                initialValues={initalvalues}
                onFinish={handleOnSubmit}
                onKeyDown={onEnter}
            >
                <div className='hflex'>

                    <Form.Item
                        label="Labour"
                        name="labour"
                        rules={[
                            {
                                required: true,
                                message: "Labour is required !"
                            },
                            {
                                validator(_, val) {
                                    if (!val) {
                                        return Promise.reject(new Error('Plz enter valid labour'));
                                    }
                                    else if (val < 1) {
                                        return Promise.reject(new Error(`Labour should be more than 0`));
                                    }
                                    else {
                                        return Promise.resolve();
                                    }
                                }
                            },
                        ]}
                    >
                        <InputNumber name='labour' type={"number"} addonAfter={"Rs/g"} />
                    </Form.Item>
                    <Form.Item
                        label="Gold 24KT"
                        name="gold_24"
                        rules={[
                            {
                                required: true,
                                message: "24KT rate is required !"
                            },
                            {
                                validator(_, val) {
                                    if (!val) {
                                        return Promise.reject(new Error('Plz enter valid 24KT rate'));
                                    }
                                    else if (val < 1) {
                                        return Promise.reject(new Error(`24KT rate should be more than 0`));
                                    }
                                    else {
                                        return Promise.resolve();
                                    }
                                }
                            },
                        ]}
                    >
                        <InputNumber name='gold_24' type={"number"} addonAfter={"/g"} />
                    </Form.Item>
                    <Form.Item
                        label="Gold 22KT"
                        name="gold_22"
                        rules={[
                            {
                                required: true,
                                message: "22KT rate is required !"
                            },
                            {
                                validator(_, val) {
                                    if (!val) {
                                        return Promise.reject(new Error('Plz enter valid 22KT rate'));
                                    }
                                    else if (val < 1) {
                                        return Promise.reject(new Error(`22KT rate should be more than 0`));
                                    }
                                    else {
                                        return Promise.resolve();
                                    }
                                }
                            },
                        ]}
                    >
                        <InputNumber name='gold_22' type={"number"} addonAfter={"/g"} />
                    </Form.Item>
                    <Form.Item
                        label="Gold 18KT"
                        name="gold_18"
                        rules={[
                            {
                                required: true,
                                message: "18KT rate is required !"
                            },
                            {
                                validator(_, val) {
                                    if (!val) {
                                        return Promise.reject(new Error('Plz enter valid 18KT rate'));
                                    }
                                    else if (val < 1) {
                                        return Promise.reject(new Error(`18KT rate should be more than 0`));
                                    }
                                    else {
                                        return Promise.resolve();
                                    }
                                }
                            },
                        ]}
                    >
                        <InputNumber name='gold_18' type={"number"} addonAfter={"/g"} />
                    </Form.Item>
                    <Form.Item
                        label="Silver"
                        name="silver_100"
                        rules={[
                            {
                                required: true,
                                message: "Silver rate is required !"
                            },
                            {
                                validator(_, val) {
                                    if (!val) {
                                        return Promise.reject(new Error('Plz enter valid Silver rate'));
                                    }
                                    else if (val < 1) {
                                        return Promise.reject(new Error(`Silver rate should be more than 0`));
                                    }
                                    else {
                                        return Promise.resolve();
                                    }
                                }
                            },
                        ]}
                    >
                        <InputNumber name='silver_100' type={"number"} addonAfter={"/g"} />
                    </Form.Item>
                </div>
            </Form>
        </Rates_Container>
    )
}

export default RatesComp;

const Rates_Container = styled.div`
    // display:flex;
    // margin:auto auto;
    width:100%;
    // justify-content:center;
    align-items:center;
    .hflex{
        display:flex;
        flex-wrap: wrap;
        width:100%;
        gap:0.5rem;
        justify-content:space-evenly;
        input{
            width:4rem;
        }
    }
`;