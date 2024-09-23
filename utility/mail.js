import BASE_URL from '@/config'
import {
  bg,
  buttonBg,
  buttonC,
  companyName,
  borderColor,
  outerBg,
  themeC,
  support_number,
  support_mail
} from './const'

const navbar = `  <div
style="
  background-color: rgb(8, 78, 67,0.1);
  padding: 10px;

"
>
<div style ="font-weight: bold;font-size: 200%;color:${themeC};">${companyName}</div>
</div>`

const footer = data => {
  return `<div style ="padding:0 10px">
<div>If you have any questions or need further assistance, please do not hesitate to contact our customer support team at ${support_mail} or ${support_number}.</div>
<p>Warm regards,</p>

<div>Quince Shop</div>
<div>House 41(meena bazar, lift 4), Gareeb-e-Newaz Avenue Road, Sector 11, Uttara, Dhaka</div>
</div>`
}

const mailVerification = data => {
  return `    <div style="padding: 10px;">
  <p>To Verify Your Account , Please use the following code bellow</p>
  <p>
    <div style ="background:rgb(8, 78, 67);text-align: center; font-size: 150%;font-weight: bolder;padding:15px;color:white">${data.code}</div>
  </p>
  <div>This will expire in 5 minutes</div>
</div>`
}

const resetPassword = data => {
  return `    <div style="padding: 10px;">
    <p>To Reset Your Account Password , Please use the following code bellow</p>
    <p>
      <div style ="background:rgb(8, 78, 67);text-align: center; font-size: 150%;font-weight: bolder;padding:15px;color:white">${data.code}</div>
    </p>
    <div>This will expire in 5 minutes</div>
  </div>`
}



const sendMessage = data => {
  return `<div style='padding:10px'> ${data.content} </div>`
}

const template = data => {
  console.log('A mail going to ', data.to, '-->', data.for)
  return `
    <div
    style="
      min-height: 100vh;
      display: flex;
      align-items: flex-start;
      justify-content: center;
      font-family: 'Ubuntu', sans-serif;
      background:${outerBg};

    "
  >
 <table style = "width:100%;height:100%;">
 <tr >
 <td align="center">   <div
 style="
   max-width: 570px;
   min-width: 320px;
   width: 100%;
   min-height: 100vh;
   text-align:left;
   background:${bg};
   padding-bottom:15px;

 "
>
${navbar}
${
  data.for == 'verification'
    ? mailVerification(data)
    : data.for == 'reset'
    ? resetPassword(data)
    : data.for == 'message'
    ? sendMessage(data)
    : resetPassword(data)
}
${footer(data)}
</div></td>
 </tr>
 </table>
  </div>
    `
}

export { template }
