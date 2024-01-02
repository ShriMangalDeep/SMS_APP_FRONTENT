import { Button, Form, Input, InputNumber, Space } from 'antd';
import React, { useState } from 'react'
import styled from 'styled-components';
import { useBillContext } from '../Context/Bill_Context';
import { useStepContext } from '../Context/Step_Context';

const TransactionComp = () => {
  const { billData, setBillData } = useBillContext();
  const { step, handleOnPrevious, handleOnNext, maxStepLimit } = useStepContext();
  const [form] = Form.useForm();
  const total = billData['purchaseprice'];
  const remaining = Form.useWatch('amount',form);
  const handleOnSubmit = (val) => {
    let temp={}
    temp['transaction']=[
      {amount:val.amount,
      transactiondate:new Date().toISOString()}
    ]
    temp['orderstatus']="unpaid"
    setBillData({...billData,...temp});
    handleOnNext();
  }

  const onEnterPress = (e) => {
    if (e.which === 13) {
      form.submit();
    }
  }

  const onFullPayement = () => {
    form.setFieldsValue({ amount: total });
    form.submit();
  }
  return (
    <Transaction_Container>
      <h1>Enter Payment Details</h1>
      <div className='Transaction_Container'>
        <Button type='primary' onClick={handleOnPrevious} disabled={!(step > 1)} >Previous</Button>
        <Form
          form={form}
          onFinish={(val) => { handleOnSubmit(val) }}
          onKeyDown={(e) => { onEnterPress(e) }}
        >
          <Form.Item
            label="Total Amount"
          >
            <Input value={total} disabled={true} suffix={"Rs Inc GST"} />
          </Form.Item>
          <div className="payment">

            <Form.Item
              name="amount"
              label={"Payment"}
              dependencies={['amount']}
              shouldUpdate
              rules={[
                {
                  required: true,
                  message: "Payment Amount is required !"
                },
                {
                  validator(_, val) {
                    if (!val) {
                      return Promise.reject(new Error('Plz Enter Valid Amount'));
                    }
                    else if (val > total) {
                      return Promise.reject(new Error(`Amount greater than ${total}`));
                    }
                    else if (val < 1) {
                      return Promise.reject(new Error(`Amount should be more than 0`));
                    }
                    else {
                      return Promise.resolve();
                    }
                  }
                },
              ]}

            >
              <Input type={'number'} autoFocus name='amount' suffix={"Rs"} />
            </Form.Item>
            <Button type={'primary'} onClick={onFullPayement} >Full</Button>
            <span>Remaining Amount : {parseFloat(total-remaining)}</span>
          </div>
          
        </Form>
        <Button type='primary' disabled={!(step <= maxStepLimit)}>Next</Button>
      </div>
    </Transaction_Container>
  )
}

export default TransactionComp;

const Transaction_Container = styled.div`
text-align:center;
form{
    display:flex;
    justify-content:space-around;
    gap:0.5rem;
    flex-wrap:wrap;
}
.Transaction_Container {  
    display: grid;
    grid-template-columns: 0.2fr 2fr 0.2fr;
    grid-template-rows: 1fr;
    gap: 0px 1rem;
    grid-auto-flow: row;
    grid-template-areas:
    ". . .";
}
.payment{
  display:flex !important;
  gap:1rem;
}
`;