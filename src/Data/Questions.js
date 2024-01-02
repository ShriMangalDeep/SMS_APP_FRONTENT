import { CameraFeed } from "../Components/CameraFeed";
import MessageComp from "../Components/MessageComp";
import MeatlQuestion from "../Components/MetalQuestion";
import PriceComp from "../Components/PriceComp";
import TransactionComp from "../Components/TransactionComp";

export const questionObj = {
    1: {
        questiontype: 'string',
        data: {
            question: "What is customer Name ?",
            qregx:/[${};<>`]/gi,
            fieldname: 'customername',
            defaultvalue:'',
            rules: [
                {
                    required: true, message: 'Cutomer Name is required !'
                },
                {
                    type: 'string',
                    message: 'Customer should be string !'
                },
                {
                    min: 5,
                    message: 'Cutomer Name should be atleast 5 character long !'
                },
                {
                    max: 100,
                    message: 'Customer Name should be atmost 100 character long !'
                }
            ]
        }
    },
    2: {
        questiontype: 'string',
        data: {
            question: "What is customer PhoneNo. ?",
            qregx:/[${};<>`\s]/gi,
            fieldname: 'phonenumber',
            defaultvalue:'',    
            rules: [
                {
                    required: true, message: 'Cutomer PhoneNo. is required !'
                },
                {
                    type: 'string',
                    message: 'Customer should be number !'
                },
                {
                    min: 10,
                    message: 'Cutomer PhoneNo. should be atleast 10 characters long !'
                },
                {
                    max: 10,
                    message: 'Customer PhoneNo. should be atmost 10 characters long !'
                },
            ]
        }
    },
    3: {
        questiontype: 'string',
        data: {
            question: "What is Product Name?",
            qregx:/[${};<>`]/gi,
            fieldname: 'productname',
            defaultvalue:'',
            rules: [
                {
                    required: true, message: 'Cutomer PhoneNo. is required !'
                },
                {
                    type: 'string',
                    message: 'Customer should be string !'
                },
                {
                    min: 5,
                    message: 'Product Name should be atleat 5 character long !'
                },
                {
                    max: 100,
                    message: 'Product Name should be atmost 100 character long !'
                }
            ]
        }
    },
    4:{
        questiontype:'customized',
        component:<MeatlQuestion />
    },
    5:{
        questiontype:'customized',
        component:<PriceComp />
    },
    6:{
        questiontype:'customized',
        component:<TransactionComp />
    },
    7:{
        questiontype:'customized',
        component:<MessageComp />
    },
    
}