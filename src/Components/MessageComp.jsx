import React, { useRef } from 'react'
import styled from 'styled-components';
import { Button, Form, Input, message, Modal } from 'antd';
import { useBillContext } from '../Context/Bill_Context';
import { useStepContext } from '../Context/Step_Context';
import CameraFeed2 from './CameraFeed2';
import axios from 'axios';
import { useReactToPrint } from 'react-to-print';
import { ComponentToPrint } from './ComponentToPrint';
import { useState } from 'react';
import { useRateContext } from '../Context/RatesContext';

const MessageComp = () => {
    const { billData, setBillData } = useBillContext();
    const {rates} = useRateContext();
    const [printFlag,setPrintFlag] = useState(false);
    const { step, handleOnPrevious, handleOnNext, maxStepLimit } = useStepContext();
    const [form] = Form.useForm();
    const componentRef = useRef();
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
        onBeforePrint:async()=>{
            // form.submit();
            // let data=await createBill();
            // console.log("=>",data);
        }
    });
    console.log(step,maxStepLimit)
    
    const createBill = async()=>{
        try{
            const {image,...rest} = billData
            const response = await axios.post("http://localhost:5000/orders/create",rest);
            console.log(response.data);
            setBillData(()=>({...billData,...response.data.data}));
            // handlePrint();
            setPrintFlag(!printFlag);
            return response;
        }
        catch(err){
            console.error(err.response.data);
        }
    }

    const handleOnSubmit = (val) => {
        console.log("calling submit",val);
        setBillData(()=>({...billData,...val}));
        createBill();
        setPrintFlag(true);
    }

    const onEnter = (e) => {
        if (e.which === 13) {
            form.submit();
        }
    }


    return (
        <Message_Container>
            <h1>Enter Message Or Image</h1>
            <div className='container'>
                <Button type='primary' onClick={handleOnPrevious} disabled={!(step > 1)} >Previous</Button>
                <Form
                    form={form}
                    onFinish={handleOnSubmit}
                    onKeyDown={onEnter}
                >
                    <Form.Item
                        name={'message'}
                        label="Message"
                        rules={[
                            {
                                type: 'string',
                                message: 'Message should be of type string !'
                            },
                            {
                                min: 5,
                                message: 'Message should atleast 5 char long !'
                            },
                            {
                                max: 300,
                                message: 'Message should be atmost 30 char long !'
                            },
                        ]}
                    >
                        <Input placeholder='Enter your message ...' autoFocus name='message' />
                    </Form.Item>
                </Form>
                {printFlag?
                <div>
                    <ComponentToPrint ref={componentRef} data={billData} rates={rates}/>
                    <Button type='primary' onClick={handlePrint} >Print</Button>
                </div>
                    :<Button onClick={()=>{console.log("submit");form.submit()}}>Submit</Button>}
            </div>
            <CameraFeed2/>

        </Message_Container>
    )
}

export default MessageComp;

const Message_Container = styled.div`
    .container {  
        display: grid;
        grid-template-columns: 0.2fr 2fr 0.2fr;
        grid-template-rows: 1fr;
        gap: 0px 1rem;
        grid-auto-flow: row;
        grid-template-areas:
        ". . .";
        text-align:center;
  }
`;