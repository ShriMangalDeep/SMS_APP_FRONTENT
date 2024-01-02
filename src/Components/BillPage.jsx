import React from 'react';
import styled from 'styled-components';
import Mangaldeep_Template_Down from '../Assets/Mangaldeep_Template_Down.png'
import Mangaldeep_Template_UP from '../Assets/Mangaldeep_Template_UP.png'
let a = ['', 'one ', 'two ', 'three ', 'four ', 'five ', 'six ', 'seven ', 'eight ', 'nine ', 'ten ', 'eleven ', 'twelve ', 'thirteen ', 'fourteen ', 'fifteen ', 'sixteen ', 'seventeen ', 'eighteen ', 'nineteen '];
let b = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

function titleCase(str) {
  var splitStr = str.toLowerCase().split(' ');
  for (var i = 0; i < splitStr.length; i++) {
    // You do not need to check if i is larger than splitStr length, as your for does that for you
    // Assign it back to the array
    splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
  }
  // Directly return the joined string
  return splitStr.join(' ');
}


function inWords(num) {
  if ((num = num.toString()).length > 9) return 'overflow';
  let n = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
  if (!n) return; var str = '';
  str += (n[1] != 0) ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'crore ' : '';
  str += (n[2] != 0) ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'lakh ' : '';
  str += (n[3] != 0) ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'thousand ' : '';
  str += (n[4] != 0) ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'hundred ' : '';
  str += (n[5] != 0) ? ((str != '') ? 'and ' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) + 'only ' : '';
  return str;
}

const BillPage = ({ data }) => {
  console.log("component to print props :", data.rates);
  let ReceviedAmt = data?.data?.transaction.reduce(function (total, curr) { return total + parseFloat(curr.amount) }, 0);
  return (
    <Bill_Container>
      <div style={{ backgroundImage: `url('${Mangaldeep_Template_UP}')`, borderBottom: '1px solid black', backgroundRepeat: 'no-repeat', backgroundPosition: 'center center', backgroundSize: 'contain', width: '100%', height: '150px', position: 'relative', top: '0' }}></div>
      <div className='content__container'>
        <div style={{ display: 'flex', borderBottom: '1px solid black', justifyContent: 'space-between', padding: '0px 12px' }}>
          <div>
            <h2>Invoice</h2>
          </div>
          <div >
            <h3>Date & Time : {Date().toString().split('GMT')[0]}</h3>
          </div>
        </div>
        <div>

          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid black', padding: '0px 12px' }}>
            <div style={{ width: '70%' }}>
              <h3>Dealer Details : </h3>
              <p>{'Mangaldeep Jewellers'}</p>
              <p>{'Vora Bazar, Opp. Nagar Pol Dela'}</p>
              <p>{'Bhavnagar - 364001'}</p>
            </div>
            <div style={{ width: '30%' }}>
              <h3>Customer Details : </h3>
              <p>Customer Name : {titleCase(data?.data?.customername || '')}</p>
              <p>Customer Phone : {data?.data?.phonenumber || "9999999999"}</p>
              <p>Invoice Id: {data?.data?._id || "634214512142251254"}</p>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-evenly', padding: '0px 12px' }}>
            {/* <div>Gold 24KT : {data?.data?.metal=='gold'?(data?.data?.metalpurity=='24KT'?(data?.data?.rate):(rates.gold_24)):(rates.gold_24) || rates?.gold_24}</div> */}
            <div>Standards Rates </div>
            <div>Gold 24KT : {data.rates?.gold_24}</div>
            <div>Gold 22KT : {data.rates?.gold_22}</div>
            <div>Gold 18KT : {data.rates?.gold_18}</div>
            <div>Silver : {data.rates?.silver}</div>
            <div>Labour : {data?.data?.labour}</div>
          </div>
        </div>
        <div style={{ height: 'max-content', padding: '0px 12px' }}>
          <table>
            <tr>
              <th>Product Name</th>
              <th>Metal</th>
              <th>Metal Purity</th>
              <th>Product Weight</th>
              <th>Rate</th>
              <th>Labour</th>
              <th>Extra</th>
              <th>ProductPrice Inc. GST</th>
            </tr>
            <tr>
              <td>{titleCase(data?.data?.productname || '')}</td>
              <td>{titleCase(data?.data?.metal || '')}</td>
              <td>{data?.data?.metalpurity}</td>
              <td>{data?.data?.productweight}</td>
              <td>{data?.data?.rate}</td>
              <td>{data?.data?.labour}</td>
              <td>{data?.data?.extra}</td>
              <td>{data?.data?.purchaseprice}</td>
            </tr>
          </table>
          <p style={{ textAlign: 'center' }}>{titleCase(data?.data?.message || 'Thanks For Trusting And Buying From Us.')}</p>
        </div>
        <div style={{ display: 'flex', flex: 1 }}>
          <div style={{ backgroundImage: `url('${data?.data?.image}')`, backgroundRepeat: 'no-repeat', backgroundPosition: 'center center', backgroundSize: 'contain', width: '100%', height: '100%' }}></div>
          <div style={{ height: '100%', width: '100%', padding: '12px' }}>
            <h3 style={{ textAlign: 'center' }}>Transaction Details</h3>
            <table>
              <tr>
                <th>Date</th>
                <th>Amount</th>
              </tr>
              {data?.data?.transaction.map((item) => {
                return <tr><td>{Date(item.transactiondate).split('GMT')[0]}</td><td>{item.amount}</td></tr>
              })}
            </table>
            <div style={{ display: 'flex', justifyContent: 'space-between', flex: '1' }}>
              <div>Recevied Amt. Total : {ReceviedAmt}</div>
              <div>Remaining Amt. Total : {parseFloat(data?.data?.purchaseprice - ReceviedAmt)}</div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', flex: '1' }}>
              <div><b>Recevied Amount In Words : </b></div>
              <div>{titleCase(inWords(parseFloat(ReceviedAmt) || 0))}</div>
            </div>
            <div style={{ display: 'flex' }}>
              <div><b>Remaining Amount In Words : </b></div>
              <div>{titleCase(inWords(parseFloat(data?.data?.purchaseprice - ReceviedAmt) || 0))}</div>
            </div>
          </div>
        </div>
      </div>
      <div style={{ backgroundImage: `url('${Mangaldeep_Template_Down}')`, backgroundRepeat: 'no-repeat', backgroundPosition: 'center center', backgroundSize: 'cover', border: '1px solid red', width: '100%', height: '80px', position: 'absolute', bottom: '0' }}></div>
    </Bill_Container>
  )
}

export default BillPage;

const Bill_Container = styled.div`
  border:1px solid black;
  height:100vh;
  width:100%;
    display: grid; 
    grid-auto-flow: row dense; 
    grid-auto-columns: 1fr 1fr; 
    grid-template-rows: max-content 1fr max-content; 
    gap: 0px 0px; 
    justify-items: stretch; 

    .content__container {  
      display: grid;
      grid-template-rows: 0.1fr 0.9fr 2fr 1.6fr;
      grid-auto-columns: 1fr;
      gap: 0px 0px;
      grid-auto-flow: row;
      grid-template-areas:
        ""
        ""
        ""
        "";
    }
    
    table {
      font-family: arial, sans-serif;
      border-collapse: collapse;
      width: 100%;
    }
    
    td, th {
      border: 1px solid black;
      text-align: left;
      padding: 8px;
    }
    
    tr:nth-child(odd) {
      background-color: #dddddd;
    }

  }
`;