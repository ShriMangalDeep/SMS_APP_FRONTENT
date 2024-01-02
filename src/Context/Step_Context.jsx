import React, { useState, useContext } from 'react'
import { questionObj } from '../Data/Questions';

const maxStepLimit = Object.entries(questionObj).length;

const StepContext = React.createContext();

export const useStepContext = () => {
    return useContext(StepContext);
}

const Step_Context = ({ children }) => {
    const [step, setStep] = useState(1);
    const handleOnNext = () => {
        if (step < maxStepLimit) {
            setStep(step + 1);
        }
    }
    const handleOnPrevious = () => {
        if (step > 1) {
            setStep(step - 1);
        }
    }
    return (
        <StepContext.Provider value={{ step, setStep, handleOnNext, handleOnPrevious, maxStepLimit }}>
            {children}
        </StepContext.Provider>
    )
}

export default Step_Context