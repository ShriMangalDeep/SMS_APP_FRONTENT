import React, { useState } from 'react'
import styled from 'styled-components';
import { Button, Form, Input, Select } from 'antd';
import axios from 'axios';

const getListing = async (sobj, setData) => {
    try {
        let result = await axios.get(`http://localhost:5000/orders/all?billType=${sobj.billType}&searchField=${sobj.searchField}&searchValue=${sobj.searchValue}`);
        console.log("success =>", result.data.data);
        setData(result.data.data);
        // await axios.get(`http://localhost:5000/orders/all?billType=${sobj.billType}&searchField=${sobj.searchField}&searchValue=${sobj.searchValue}`).then((result)=>{
        //     console.log("Success ",result);
        //     setData(result.data.data); 
        //     // return result;
        // }).catch((err)=>{console.log("error",err)
        //     return err;
        // });

        // return await results.json();
    }
    catch (err) {
        console.error("Error while fetching bill", err);
    }
}

const Bill_Listing = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const handleOnSubmit = (val) => {
        console.log(val);
        setLoading(true);
        getListing(val, setData)
        // getListing(val).then((result)=>{console.log("ans=>",result)});
        // console.log("=====>",resultData)
        // setData(resultData.data)
        setLoading(false);
    }
    return (
        <Bill_Listing_Container>
            <div className="search_form_container">
                <Form
                    form={form}
                    onFinish={handleOnSubmit}
                >
                    <div className="hflex">
                        <Form.Item
                            name={'billType'}
                            label={'Bill Type'}
                            rules={[
                                {
                                    required: true,
                                    message: 'Bill Type is required !'
                                }
                            ]}
                        >
                            <Select
                                name='billType'
                                // defaultValue={'unpaid'}
                                options={[
                                    {
                                        value: 'unpaid',
                                        label: 'Un-Paid',
                                    },
                                    {
                                        value: 'paid',
                                        label: 'Paid',
                                    },
                                    {
                                        value: 'all',
                                        label: 'All'
                                    }
                                ]}
                            >
                            </Select>
                        </Form.Item>
                        <Form.Item
                            name={'searchField'}
                            label={'Search By'}
                            rules={[
                                {
                                    required: true,
                                    message: 'Search Field is required !'
                                }
                            ]}
                        >
                            <Select
                                name='searchField'
                                // defaultValue={'all'}
                                options={[
                                    {
                                        value: 'phonenumber',
                                        label: 'Phone Number'
                                    },
                                    {
                                        value: 'customername',
                                        label: 'Customer Name'
                                    },
                                    {
                                        value: 'all',
                                        label: 'All'
                                    }
                                ]}
                            >

                            </Select>
                        </Form.Item>
                        <Form.Item
                            label={'Search For'}
                            name={'searchValue'}
                        >
                            <Input name='searchValue' placeholder='Enter Value ...' />
                        </Form.Item>
                        <Form.Item style={{ textAlign: 'center' }}>
                            <Button onClick={() => { form.submit(); }} type='primary'>Search</Button>
                        </Form.Item>
                    </div>
                </Form>
            </div>
            <div className="listing_container">
                <table className='table responsive'>
                    <thead>
                        <tr>
                            <td>Customer Name</td>
                            <td>Phone Number</td>
                            <td>Order Status</td>
                            <td>Product Name</td>
                            <td>Product Weight</td>
                            <td>Metal</td>
                            <td>Operations</td>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item, index) => {
                            return (
                                <tr key={index}>
                                    <td data-label="Customer Name">{item.customername}</td>
                                    <td data-label="Phone Number">{item.phonenumber}</td>
                                    <td data-label="Order Status" >{item.orderstatus}</td>
                                    <td data-label="Product Name" >{item.productname}</td>
                                    <td data-label="Product Weight">{item.productweight}</td>
                                    <td data-label="Metal Type">{item.metal}</td>
                                    <td data-label="Operations">
                                        <div className='hflex'>
                                            <button>Details</button>
                                            <button>Print</button>
                                            {item.orderstatus === "paid" ? <></> : <button>Full Payment</button>}
                                        </div>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </Bill_Listing_Container>
    )
}

export default Bill_Listing;

const Bill_Listing_Container = styled.div`
    display:flex;
    // border:1px solid red;
    flex-direction:column;
    .hflex{
        width:100%;
        display:flex;
        gap:1rem;
    }
    .ant-form-item{
        justify-content: space-evenly !important;
        width:250px;
        flex:1 !important;
    }
    .search_form_container{
        width:100%;
        display:flex;
    }

    .table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 40px;
    }

    .table td {
        padding: 7px 10px;
        border: 1px solid;
    }

    .table thead{
        background:grey;
        color:white;
    }

    @media only screen and (max-device-width: 555px) {
        .hflex{
            flex-direction:column !important;
            gap:0.5rem;
        }
        .ant-form-item{
            width:100% !important;
            flex-direction:column !important;
        }
        .search_form_container{
            flex-direction:column;
        }
        .responsive thead {
            visibility: hidden;
            height: 0;
            position: absolute;
          }
        
          .responsive tr {
            display: block;
            margin-bottom: 0.625em;
          }
        
          .responsive td {
            border: 1px solid;
            border-bottom: none;
            display: block;
            font-size: 0.8em;
            text-align: right;
          }
        
          .responsive td::before {
            content: attr(data-label);
            float: left;
            font-weight: bold;
            text-transform: uppercase;
          }
        
          .responsive td:last-child {
            border-bottom: 1px solid;
          }
    }
`;