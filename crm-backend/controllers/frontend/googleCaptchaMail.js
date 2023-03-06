
const { Email } = require("../../common/Email");

/* Mail to verify google captcha */
const mailToVerifyCaptcha = async (req, res) => {

   const { body } = req;
   try {

      const $message1 = `
      <html>
      <head>
        <title>Thank you for filling out your information!</title>
      </head>
      <body>
        <html>
        <head>
          <title>Form Details</title>
        </head>
        <body>
          <div style="background:#f3f3f3;width:100%;    padding: 20px 0px;">
            <div style="width:550px;margin:auto;">
              <div style="    text-align: center;background: #6d48f2;padding: 40px 0px;">
                <img src="http://serviceadvisor.io/images/serviceAdvisor.png" alt="logo" style="width:230px;" />
              </div>
              <table cellpadding="0" cellspacing="0" border="0" width="100%"
                style="width: 100%;background: #fff;padding: 20px 30px;">
                <tbody>
                  <tr>
                    <td align="left" valign="top">
                      <font face="Source Sans Pro, sans-serif" color="#1a1a1a">
                        <span
                          style="font-family: Source Sans Pro, Arial, Tahoma, Geneva, sans-serif; color: #1a1a1a; font-size: 18px; line-height: 25px; font-weight: 300; letter-spacing: 0.5px;">Hey
                          ${body.fname1}</span>
                      </font>
                      <div style="height: 15px; line-height: 15px; font-size: 31px;">&nbsp;</div>
                      <font face="Source Sans Pro, sans-serif" color="#585858">
                        <span
                          style="font-family: Source Sans Pro, Arial, Tahoma, Geneva, sans-serif; color: #585858; font-size: 15px; line-height: 23px;">Thank
                          you for Showing interest in us! You are very important to us, all information
                          received will always remain confidential.</span>
                      </font>
                      <div style="height: 20px; line-height: 20px; font-size: 18px;">&nbsp;</div>
      
                      <font face="Source Sans Pro, sans-serif" color="#585858">
                        <span
                          style="font-family: Source Sans Pro, Arial, Tahoma, Geneva, sans-serif; color: #585858; font-size: 15px; line-height: 23px;">Regards,</span>
                      </font><br>
                      <font face="Source Sans Pro, sans-serif" color="#585858">
                        <span
                          style="font-family: Source Sans Pro, Arial, Tahoma, Geneva, sans-serif; color: #585858; font-size: 15px; line-height: 23px;">Service
                          Advisor Team</span>
                      </font>
                      <div style="height: 20px; line-height: 20px; font-size: 18px;">&nbsp;</div>
                    </td>
                  </tr>
                </tbody>
              </table>
              <table cellpadding="0" cellspacing="0" border="0" width="100%"
                style="width: 100%; background: #fff;padding: 20px 0px;     border-top: 1px solid #dddd;">
                <tbody>
                  <tr>
                    <td align="center" valign="top">
                      <!--<table cellpadding="0" cellspacing="0" border="0" width="78%" style="min-width: 300px;">
                           <tbody><tr>
                              <td align="center" valign="top" width="23%">                                             
                                 <a href="#" target="_blank" style="font-family: Source Sans Pro, Arial, Tahoma, Geneva, sans-serif; color: #1a1a1a; font-size: 14px; line-height: 20px; text-decoration: none; white-space: nowrap; font-weight: bold;">
                                    <font face="Source Sans Pro, sans-serif" color="#1a1a1a" style="font-size: 14px; line-height: 20px; text-decoration: none; white-space: nowrap; font-weight: bold;">
                                       <span style="font-family: Source Sans Pro, Arial, Tahoma, Geneva, sans-serif; color: #1a1a1a; font-size: 14px; line-height: 20px; text-decoration: none; white-space: nowrap; font-weight: bold;">HELP CENTER</span>
                                    </font>
                                 </a>
                              </td>
                              <td align="center" valign="top" width="10%">
                                 <font face="Source Sans Pro, sans-serif" color="#1a1a1a" style="font-size: 17px; line-height: 17px; font-weight: bold;">
                                    <span style="font-family: Source Sans Pro, Arial, Tahoma, Geneva, sans-serif; color: #1a1a1a; font-size: 17px; line-height: 17px; font-weight: bold;">•</span>
                                 </font>
                              </td>
                              <td align="center" valign="top" width="23%">
                                 <a href="#" target="_blank" style="font-family: Source Sans Pro, Arial, Tahoma, Geneva, sans-serif; color: #1a1a1a; font-size: 14px; line-height: 20px; text-decoration: none; white-space: nowrap; font-weight: bold;">
                                    <font face="Source Sans Pro, sans-serif" color="#1a1a1a" style="font-size: 14px; line-height: 20px; text-decoration: none; white-space: nowrap; font-weight: bold;">
                                       <span style="font-family: Source Sans Pro, Arial, Tahoma, Geneva, sans-serif; color: #1a1a1a; font-size: 14px; line-height: 20px; text-decoration: none; white-space: nowrap; font-weight: bold;">SUPPORT 24/7</span>
                                    </font>
                                 </a>
                              </td>
                              <td align="center" valign="top" width="10%">
                                 <font face="Source Sans Pro, sans-serif" color="#1a1a1a" style="font-size: 17px; line-height: 17px; font-weight: bold;">
                                    <span style="font-family: Source Sans Pro, Arial, Tahoma, Geneva, sans-serif; color: #1a1a1a; font-size: 17px; line-height: 17px; font-weight: bold;">•</span>
                                 </font>
                              </td>
                              <td align="center" valign="top" width="23%">
                                 <a href="#" target="_blank" style="font-family: Source Sans Pro, Arial, Tahoma, Geneva, sans-serif; color: #1a1a1a; font-size: 14px; line-height: 20px; text-decoration: none; white-space: nowrap; font-weight: bold;">
                                    <font face="Source Sans Pro, sans-serif" color="#1a1a1a" style="font-size: 14px; line-height: 20px; text-decoration: none; white-space: nowrap; font-weight: bold;">
                                       <span style="font-family: Source Sans Pro, Arial, Tahoma, Geneva, sans-serif; color: #1a1a1a; font-size: 14px; line-height: 20px; text-decoration: none; white-space: nowrap; font-weight: bold;">FAQ</span>
                                    </font>
                                 </a>
                              </td>
                           </tr>
                        </tbody></table>
                        <div style="height: 34px; line-height: 34px; font-size: 32px;"> </div>-->
                      <font face="Source Sans Pro, sans-serif" color="#868686" style="font-size: 17px; line-height: 20px;">
                        <span
                          style="font-family: Source Sans Pro, Arial, Tahoma, Geneva, sans-serif; color: #868686; font-size: 14px; line-height: 20px;">Copyright
                          © 2019 Service Advisor. All Rights Reserved.</span>
                      </font>
                      <div style="height: 5px; line-height: 5px; font-size: 1px;"> </div>
                      <font face="Source Sans Pro, sans-serif" color="#1a1a1a">
                        <span
                          style="font-family: Source Sans Pro, Arial, Tahoma, Geneva, sans-serif; color: #1a1a1a; font-size: 15px; line-height: 20px;"><a
                            href="mailto:help@service.com" target="_blank"
                            style="font-family: Source Sans Pro, Arial, Tahoma, Geneva, sans-serif; color: #1a1a1a; font-size: 13px; line-height: 20px; text-decoration: none;">help@service.com</a>
                          | <a href="tele:1(800)232-90-26" target="_blank"
                            style="font-family: Source Sans Pro, Arial, Tahoma, Geneva, sans-serif; color: #1a1a1a; font-size: 13px; line-height: 20px; text-decoration: none;">1(800)232-90-26</a>
                      </font>
                      <div style="height: 35px; line-height: 35px; font-size: 33px;"> </div>
                      <table cellpadding="0" cellspacing="0" border="0" width="100%"
                      style="width: 100%; background: #fff;padding: 20px 0px;     border-top: 1px solid #dddd;">
                      <tbody>
                        <tr>
                          <td align="center" valign="top">
                            <div style="height: 34px; line-height: 34px; font-size: 32px;"> </div>-->
                            <font face="Source Sans Pro, sans-serif" color="#868686">
                              <span
                                style="font-family: Source Sans Pro, Arial, Tahoma, Geneva, sans-serif; color: #868686; font-size: 14px; line-height: 20px;">Copyright
                                © 2019 Service Advisor. All Rights Reserved.</span>
                            </font>
                            <div style="height: 5px; line-height: 5px; font-size: 1px;"> </div>
                            <font face="Source Sans Pro, sans-serif" color="#1a1a1a">
                              <span
                                style="font-family: Source Sans Pro, Arial, Tahoma, Geneva, sans-serif; color: #1a1a1a; font-size: 15px; line-height: 20px;"><a
                                  href="mailto:help@service.com" target="_blank"
                                  style="font-family: Source Sans Pro, Arial, Tahoma, Geneva, sans-serif; color: #1a1a1a; font-size: 13px; line-height: 20px; text-decoration: none;">help@service.com</a>
                                | <a href="tele:1(800)232-90-26" target="_blank"
                                  style="font-family: Source Sans Pro, Arial, Tahoma, Geneva, sans-serif; color: #1a1a1a; font-size: 13px; line-height: 20px; text-decoration: none;">1(800)232-90-26</a>
                            </font>
                            <div style="height: 35px; line-height: 35px; font-size: 33px;"> </div>
                              <table cellpadding="0" cellspacing="0" border="0">
                                <tbody>
                                  <tr>
                                    <td align="center" valign="top">
                                      <a href="#" target="_blank" style="display: block; max-width: 19px;">
                                          <img src="http://serviceadvisor.io/images/soc_2.png" alt="img" width="19" border="0" style="display: block; width: 19px;">
                                      </a>
                                    </td>
                                    <td width="45" style="width: 45px; max-width: 45px; min-width: 45px;"> </td>
                                    <td align="center" valign="top">
                                      <a href="#" target="_blank" style="display: block; max-width: 18px;">
                                          <img src="http://serviceadvisor.io/images/soc_3.png" alt="img" width="18" border="0" style="display: block; width: 18px;">
                                      </a>
                                    </td>
                                </tr>
                              </tbody>
                          </table>    
                        <div style="height: 35px; line-height: 35px; font-size: 33px;"> </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </body>
        </html>`
      const $messageToAdmin = `<html>

      <head>
        <title>Form Details</title>
      </head>
      
      <body>
        <div style="background:#f3f3f3;width:100%;    padding: 20px 0px;">
          <div style="width:550px;margin:auto;">
            <div style="    text-align: center;background: #6d48f2;padding: 40px 0px;">
              <img src="http://serviceadvisor.io/images/serviceAdvisor.png" alt="logo" style="width:230px;" />
            </div>
            <div style=" background: #ffffff; width:100%;padding: 30px 0px;">
      
              <div style="padding: 10px 30px;">
                <font face="Source Sans Pro, sans-serif" color="#585858">
                  <span
                    style="font-family:Source Sans Pro,Arial,Tahoma,Geneva,sans-serif;color:#585858;font-size:16px;line-height:23px;">You
                    have recieved a Potential Lead. Please see the details below:</span>
                </font>
              </div>
              <h5 style="text-align:center;margin: 0px 0px 20px;font-size: 20px;color: #6d48f2;">User Details</h5>
              <table cellpadding="0" cellspacing="0" border="0" width="100%" style="min-width: 300px;">
                <tbody>
                  <tr>
                    <td align="right" valign="top" width="23%">
                      <a href="#"
                        style="font-family: Source Sans Pro, Arial, Tahoma, Geneva, sans-serif; color: #1a1a1a; font-size: 16px; line-height: 24px; text-decoration: none; white-space: nowrap; font-weight: normal;">
                        <font face="Source Sans Pro, sans-serif" color="#1a1a1a">
                          <span
                            style="font-family: Source Sans Pro, Arial, Tahoma, Geneva, sans-serif; color: #1a1a1a; font-size: 16px; line-height: 24px; text-decoration: none; white-space: nowrap; font-weight: normal;">First
                            Name:</span>
                        </font>
                      </a>
                    </td>
                    <td align="center" valign="top" width="3%">
                    </td>
                    <td align="left" valign="top" width="23%">
                      <a href="#"
                        style="font-family: Source Sans Pro, Arial, Tahoma, Geneva, sans-serif; color: #1a1a1a; font-size: 16px; line-height: 24px; text-decoration: none; white-space: nowrap; font-weight: normal;">
                        <font face="Source Sans Pro, sans-serif" color="#1a1a1a">
                          <span
                            style="font-family: Source Sans Pro, Arial, Tahoma, Geneva, sans-serif; color: #1a1a1a; font-size: 16px; line-height: 24px; text-decoration: none; white-space: nowrap; font-weight: normal;">${
                            body.fname1
                            }</span>
                        </font>
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td colspan="3">
                      <div style="height: 5px; line-height: 5px; font-size: 1px;"> </div>
                    </td>
                  </tr>
                  <tr>
                    <td align="right" valign="top" width="23%">
                      <a href="#"
                        style="font-family: Source Sans Pro, Arial, Tahoma, Geneva, sans-serif; color: #1a1a1a; font-size: 16px; line-height: 24px; text-decoration: none; white-space: nowrap; font-weight: normal;">
                        <font face="Source Sans Pro, sans-serif" color="#1a1a1a">
                          <span
                            style="font-family: Source Sans Pro, Arial, Tahoma, Geneva, sans-serif; color: #1a1a1a; font-size: 16px; line-height: 24px; text-decoration: none; white-space: nowrap; font-weight: normal;">Last
                            Name:</span>
                        </font>
                      </a>
                    </td>
                    <td align="center" valign="top" width="3%">
                    </td>
                    <td align="left" valign="top" width="23%">
                      <a href="#"
                        style="font-family: Source Sans Pro, Arial, Tahoma, Geneva, sans-serif; color: #1a1a1a; font-size: 16px; line-height: 24px; text-decoration: none; white-space: nowrap; font-weight: normal;">
                        <font face="Source Sans Pro, sans-serif" color="#1a1a1a" st>
                          <span
                            style="font-family: Source Sans Pro, Arial, Tahoma, Geneva, sans-serif; color: #1a1a1a; font-size: 16px; line-height: 24px; text-decoration: none; white-space: nowrap; font-weight: normal;">${
                            body.lname1
                            }</span>
                        </font>
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td colspan="3">
                      <div style="height: 10px; line-height: 10px; font-size: 1px;"> </div>
                    </td>
                  </tr>
                  <tr>
                    <td align="right" valign="top" width="23%">
                      <a href="#"
                        style="font-family: Source Sans Pro, Arial, Tahoma, Geneva, sans-serif; color: #1a1a1a; font-size: 16px; line-height: 24px; text-decoration: none; white-space: nowrap; font-weight: normal;">
                        <font face="Source Sans Pro, sans-serif" color="#1a1a1a">
                          <span
                            style="font-family: Source Sans Pro, Arial, Tahoma, Geneva, sans-serif; color: #1a1a1a; font-size: 16px; line-height: 24px; text-decoration: none; white-space: nowrap; font-weight: normal;">Email
                            Address:</span>
                        </font>
                      </a>
                    </td>
                    <td align="center" valign="top" width="3%">
                    </td>
                    <td align="left" valign="top" width="23%">
                      <a href="mailto:'.$emailfrom.'"
                        style="font-family: Source Sans Pro, Arial, Tahoma, Geneva, sans-serif; color: #1a1a1a; font-size: 16px; line-height: 24px; text-decoration: underline; white-space: nowrap; font-weight: normal;">
                        <font face="Source Sans Pro, sans-serif" color="#1a1a1a">
                          <span
                            style="font-family: Source Sans Pro, Arial, Tahoma, Geneva, sans-serif; color: #1a1a1a; font-size: 16px; line-height: 24px; text-decoration: underline; white-space: nowrap; font-weight: normal;">'.${body.email1}.'</span>
                        </font>
                      </a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <table cellpadding="0" cellspacing="0" border="0" width="100%"
              style="width: 100%; background: #fff;padding: 20px 0px;     border-top: 1px solid #dddd;">
              <tbody>
                <tr>
                  <td align="center" valign="top">
                    <div style="height: 34px; line-height: 34px; font-size: 32px;"> </div>-->
                    <font face="Source Sans Pro, sans-serif" color="#868686">
                      <span
                        style="font-family: Source Sans Pro, Arial, Tahoma, Geneva, sans-serif; color: #868686; font-size: 14px; line-height: 20px;">Copyright
                        © 2019 Service Advisor. All Rights Reserved.</span>
                    </font>
                    <div style="height: 5px; line-height: 5px; font-size: 1px;"> </div>
                    <font face="Source Sans Pro, sans-serif" color="#1a1a1a">
                      <span
                        style="font-family: Source Sans Pro, Arial, Tahoma, Geneva, sans-serif; color: #1a1a1a; font-size: 15px; line-height: 20px;"><a
                          href="mailto:help@service.com" target="_blank"
                          style="font-family: Source Sans Pro, Arial, Tahoma, Geneva, sans-serif; color: #1a1a1a; font-size: 13px; line-height: 20px; text-decoration: none;">help@service.com</a>
                        | <a href="tele:1(800)232-90-26" target="_blank"
                          style="font-family: Source Sans Pro, Arial, Tahoma, Geneva, sans-serif; color: #1a1a1a; font-size: 13px; line-height: 20px; text-decoration: none;">1(800)232-90-26</a>
                    </font>
                    <div style="height: 35px; line-height: 35px; font-size: 33px;"> </div>
                      <table cellpadding="0" cellspacing="0" border="0">
                        <tbody>
                          <tr>
                            <td align="center" valign="top">
                              <a href="#" target="_blank" style="display: block; max-width: 19px;">
                                  <img src="http://serviceadvisor.io/images/soc_2.png" alt="img" width="19" border="0" style="display: block; width: 19px;">
                              </a>
                            </td>
                            <td width="45" style="width: 45px; max-width: 45px; min-width: 45px;"> </td>
                            <td align="center" valign="top">
                              <a href="#" target="_blank" style="display: block; max-width: 18px;">
                                  <img src="http://serviceadvisor.io/images/soc_3.png" alt="img" width="18" border="0" style="display: block; width: 18px;">
                              </a>
                            </td>
                        </tr>
                      </tbody>
                  </table>                    
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </body>
      
      </html>`;
      
      const $email_to_adnmin = "jsabellico@jlouis.com";
      const emailVar = new Email(body);
      await emailVar.setSubject(
         "[Service Advisor]" + body.$subject + " - Verification Link"
      );
      await emailVar.setBody($messageToAdmin);
      await emailVar.sendEmail($email_to_adnmin);
      const email1Var = new Email(body);
      await email1Var.setSubject(
         "[Service Advisor]" + "Thankyou for subscribing"
      );
      await email1Var.setBody($message1);
      await email1Var.sendEmail(body.email1);
      return res.status(200).json({
         message: "Verification link send successfully!",
         success: true
      });
   } catch (error) {
      console.log("this is send mail error", error);
      return res.status(500).json({
         message: error.message ? error.message : "Unexpected error occure.",
         success: false
      });
   }
};
module.exports = {
   mailToVerifyCaptcha
};
