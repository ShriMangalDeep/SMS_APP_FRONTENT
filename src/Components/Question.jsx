import React, { useState, useEffect } from 'react'
import styled from 'styled-components';
import { Button, Form, Input } from 'antd'
import { useBillContext } from '../Context/Bill_Context';
import { useStepContext } from '../Context/Step_Context';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

const Question = ({ data }) => {
    const {step,maxStepLimit,handleOnNext,handleOnPrevious} = useStepContext();
    const { billData, setBillData } = useBillContext();
    const [formdata, setFormData] = useState('');
    const [form] = Form.useForm();
    const {
        transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition,
        browserSupportsContinuousListening
    } = useSpeechRecognition();

    useEffect(() => {
        let temp = transcript.toString().replace(data['qregx'], '');
        setFormData(temp);
        form.setFieldValue(data['fieldname'], temp);
    }, [transcript])

    const handleSubmit = (val) => {
        let temp = {};
        temp[data['fieldname']] = formdata;
        setBillData({ ...billData, ...temp });
        handleOnNext();
    }

    const handleKeypress = e => {
        console.log(e.which);
        //it triggers by pressing the enter key
        if (e.which === 13) {
            handleSubmit();
        }
    };


    const handleChange = (e) => {
        let temp = (e.target.value).replace(data['qregx'], '');
        setFormData(temp);
        form.setFieldValue(data['fieldname'], temp);
    }

    if (!browserSupportsSpeechRecognition) {
        return <span>Browser doesn't support speech recognition.</span>;
    }
    return (<Question_Container>
        <p>Microphone: {listening ? 'on' : 'off'}</p>
        <h1>{data.question}</h1>
        <div className='Question_Container'>
            <Button type='primary' onClick={handleOnPrevious} disabled={!(step > 1)} >Previous</Button>
            <Form
                form={form}
                onFinish={handleSubmit}
                onKeyPress={handleKeypress}
            >
                <Form.Item
                    rules={data['rules']}
                    name={data['fieldname']}
                >
                    <Input onFocus={SpeechRecognition.startListening} autoFocus onClick={SpeechRecognition.startListening} name={data['fieldname']}  placeholder='Say Something ...' onChange={(e) => { handleChange(e) }} />
                </Form.Item>
            </Form>
            <Button type='primary' onClick={handleSubmit} disabled={!(step < maxStepLimit)}>Next</Button>
        </div>
    </Question_Container>)
}

export default Question;

const Question_Container = styled.div`
  text-align:center;

  .Question_Container {  
    display: grid;
    grid-template-columns: 0.2fr 2fr 0.2fr;
    grid-template-rows: 1fr;
    gap: 0px 1rem;
    grid-auto-flow: row;
    grid-template-areas:
      ". . .";
  }
  
`;