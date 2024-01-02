import React, { useState, useEffect } from 'react'
import { useStepContext } from '../Context/Step_Context';
import { useBillContext } from '../Context/Bill_Context';
import Question from '../Components/Question';
import { questionObj } from '../Data/Questions';
import styled from 'styled-components';

const Bill_Generator = () => {
  const { step } = useStepContext();
  const { billData } = useBillContext();
  let component;
  if (questionObj[step].questiontype === 'string') {
    component = <Question data={questionObj[step].data} />
  }
  else if (questionObj[step].questiontype === 'numbers') {
    component = <p>Numbers</p>
  }
  else {
    component = questionObj[step].component;
  }

  return (
    <Bill_Container>
      {component}
      <div className='data_conteiner'>
        <b><i><pre>{JSON.stringify(billData, null, 2)}</pre></i></b>
      </div>

    </Bill_Container>
  )
}

export default Bill_Generator;

const Bill_Container = styled.div`
  display:flex;
  justify-content:center;
  flex-direction:column;
  align-item:center;

  .data_conteiner{
    margin:auto auto;
    font-size:1.2rem;
    font-family:palatino,serif;
  }
`;