import React,{useState,useContext} from 'react'

const data={
    customername:"",
    phonenumber:"",
    productname:"",
    metal:"",
    metalpurity:"",
    productweight:0,
    orderstatus:"",
    message:"",
    purchaseprice:0,
    purchasedate:"",
    transaction:[],
    rate:"",
    labour:0,
    extra:0
}

const BillContext=React.createContext({})

export const useBillContext=()=>{
    return useContext(BillContext);
}

const Bill_Context = ({children}) => {
    const [billData,setBillData] = useState(data);
    return (
        <BillContext.Provider value={{billData,setBillData}}>
            {children}
        </BillContext.Provider>
    )
}

export default Bill_Context