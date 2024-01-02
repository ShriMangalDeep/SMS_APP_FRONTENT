import React from 'react';
import styled from 'styled-components';
import { Button, Form, Select } from 'antd';
import { useBillContext } from '../Context/Bill_Context';
import { useStepContext } from '../Context/Step_Context';
import { useRateContext } from '../Context/RatesContext';

export const MeatlQuestion = () => {
    const { billData, setBillData } = useBillContext();
    const {rates,labour} = useRateContext();
    const { step, handleOnPrevious, handleOnNext, maxStepLimit } = useStepContext();
    const onChange = (value) => {
        let [purity, metal] = value.split('_');
        let temp = {}
        temp['metal'] = metal;
        temp['metalpurity'] = purity;
        temp['rate'] = rates[`${metal}_${purity.replace('KT','').replace('%','')}`]
        temp['purchasedate']=new Date().toISOString();
        temp['labour']=rates['labour'];

        console.log(temp); 
        setBillData({ ...billData, ...temp })
        handleOnNext();
    };
    const onSearch = (value) => {

    };


    return <Metal_Container_Div>
        <p>Microphone: off</p>
        <h1>Select Metal Type and Purity</h1>
        <div className='container'>
            <Button type='primary' onClick={handleOnPrevious} disabled={!(step > 1)} >Previous</Button>
            <Form
                onFinish={onChange}
            >
                <Form.Item
                    rules={[
                        {
                            required: true,
                            message: 'Please Select Metal Type and Purity'
                        }
                    ]}
                >
                    <Select
                        autoFocus
                        showSearch
                        placeholder="Select a Metal Type"
                        optionFilterProp="children"
                        onChange={onChange}
                        onSearch={onSearch}
                        filterOption={(input, option) =>
                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                        }
                        options={[
                            {
                                value: '100%_silver',
                                label: 'Silver',
                            },
                            {
                                value: '100%_immitation',
                                label: 'Immitation',
                            },
                            {
                                value: '18KT_gold',
                                label: '18 Carat Gold',
                            },
                            {
                                value: '22KT_gold',
                                label: '22 Carat Gold',
                            },
                            {
                                value: '24KT_gold',
                                label: '24 Carat Gold',
                            },
                        ]}
                    />
                </Form.Item>
            </Form>
            <Button type='primary' disabled={!(step <= maxStepLimit)}>Next</Button>
        </div>
    </Metal_Container_Div>
}

export default MeatlQuestion;

const Metal_Container_Div = styled.div`
    text-align:center;
    .ant-select{
        width:100% !important;
    }
    .container {  display: grid;
        grid-template-columns: 0.2fr 2fr 0.2fr;
        grid-template-rows: 1fr;
        gap: 0px 1rem;
        grid-auto-flow: row;
        grid-template-areas:
          ". . .";
      }
`;