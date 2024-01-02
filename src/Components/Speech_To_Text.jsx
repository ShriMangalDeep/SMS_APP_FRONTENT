import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { Button, Form, Input, notification, Switch } from 'antd';


const openNotification = (openType,message,description,placement) => {
  switch(openType)
  {
      case 'info':
          notification.info({
              message,
              description,
              placement,
              duration:3
            });
            break;
      case 'success':
          notification.success({
              message,
              description,
              placement,
              duration:3
              });
              break;
      case 'error':
          notification.error({
              message,
              description,
              placement,
              duration:3
              });
          break;
      case 'warning':
          notification.warning({
              message,
              description,
              placement,
              duration:3
              });
              break;
      default :
              break;
  }
};

const question = {
  1: {
    field: 'name',
    question: 'What is Customer Name ?'
  },
  2: {
    field: 'labour',
    question: "What is labour charge ?"
  }
}


export const Speech_To_Text = () => {
  const commands =[
    {
      command: ['ok done','ok next','next','ok','next','next question'],
      callback:({command})=>{setuserIpt(userIpt.replace(command,''));handleNext(command)}
    },
    {
      command: ['new bill','create bill','generate bill','clear all'],
      callback: ({ resetTranscript }) => {resetTranscript();setData({});setIdx(1)}
    }
  ]
  const [idx, setIdx] = useState(1);
  const [userIpt,setuserIpt] = useState('');
  const [data, setData] = useState({});
  const [form] = Form.useForm();

  const handleNext = (command)=>{
    if(userIpt.trim().length===0 || userIpt.trim()==="")
    {
      openNotification('error','Please Speak Again','','top');
    }
    else
    {
      let temdata = {}
      temdata[`${question[idx]['field']}`] = userIpt
      setData({ ...data, ...temdata });
      resetTranscript();
      setIdx(idx+1);
      console.log(data);
    }
  }

  const handleOnCommandChange=(checked)=>{
    if(checked)
    {
      if(browserSupportsContinuousListening)
      {
        SpeechRecognition.startListening({ continuous: true })
      }
      else
      {
        openNotification('error','Continuos Listining Not Supported','','top')
      }
      }
    else
    {
        SpeechRecognition.startListening({ continuous: false })
    }
  }

  const handlePrevious=()=>{
    resetTranscript();
    setIdx(idx-1);
  }
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
    browserSupportsContinuousListening
  } = useSpeechRecognition({commands });

  useEffect(()=>{
    setuserIpt(transcript.toString());
    form.setFieldValue('user_input',transcript);
  },[transcript])


  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  }
  return (
    <Bill_Container>
      <p>Microphone: {listening ? 'on' : 'off'}</p>
      <p>Command: <Switch onChange={handleOnCommandChange} checkedChildren="Yes" unCheckedChildren="No"  /></p>
      <h1>{question[idx]?.question}</h1>
      <Form style={{width:"70%"}} form={form}>
        <Form.Item name="user_input"><Input.TextArea autoSize value={userIpt} onClick={SpeechRecognition.startListening} name='user_input' placeholder='Speak anything ...' onChange={(e)=>{setuserIpt(e.target.value)}} /></Form.Item>
      </Form>
      {/* <button onClick={SpeechRecognition.stopListening}>Stop</button> */}
      <p>{transcript}</p>
      <div className='button_Container'>
        <div className="hflex">
          <Button type='primary' onClick={handlePrevious} >&laquo; Prevs</Button>
          <Button type='primary' onClick={SpeechRecognition.startListening} className='start_button'>{listening ? 'Listening' : 'Speak'}</Button>
          <Button type='primary'onClick={handleNext} >Next &raquo;</Button>
        </div>
        <div style={{display:'flex',justifyContent:'center'}}><Button onClick={resetTranscript} type='primary'>Reset</Button></div>
      </div>
    </Bill_Container>
  )
}

const Bill_Container = styled.div`
  display:flex;
  justify-content:center;
  align-items:center;
  flex-direction:column;

  textarea{
    text-align:center;
  }

  .hflex{
    display:flex;
    justify-content:space-evenly;
    align-items:center;
    gap:1rem;
  }

  .button_Container{
    position:fixed;
    display:flex;
    flex-direction:column;
    border:1px solid red;
    bottom:10%;
    padding:2rem;
    gap:1rem;
  }

  .start_button{
    width:5rem;
    height:5rem;
    border-radius:100%;
    text-align:center;
  }
`;