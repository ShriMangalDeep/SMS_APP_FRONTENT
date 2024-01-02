import React, { useContext, useState } from 'react'

function setCookie(name,value,days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}
function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}
function eraseCookie(name) {   
    document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

const obj = {
    gold_22: parseFloat(getCookie('gold_22')) || 0,
    gold_24: parseFloat(getCookie('gold_24')) || 0,
    gold_18: parseFloat(getCookie('gold_18')) || 0,
    silver_100: parseFloat(getCookie('silver_100') )|| 0,
    labour: parseFloat(getCookie('labour') )|| 0
}


const RateContext = React.createContext();

export const useRateContext = () => {
    return useContext(RateContext);
}

const UpdateRates = (rates)=>{
    Object.entries(rates).forEach(([key,value])=>{
        setCookie(key,value);
    })
}
const RatesContext = ({ children }) => {
    const [rates,setRates] = useState({...obj});
    UpdateRates(rates);
    return (
        <RateContext.Provider value={{rates,setRates}} >
            {children}
        </RateContext.Provider>
    )
}

export default RatesContext