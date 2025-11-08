import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);

type EmailData = { subject: string; html: string };

export const MatchEmail = (
  lmk: string,
  headline: string,
  link: string,
  source: string
) => {
  return {
    subject: `New match for your LMK: ${headline}`,
    html: `
<!DOCTYPE html>
<html xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">

<head>
 <meta charset="UTF-8" />
 <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
 <!--[if !mso]><!-- -->
 <meta http-equiv="X-UA-Compatible" content="IE=edge" />
 <!--<![endif]-->
 <meta name="viewport" content="width=device-width, initial-scale=1.0" />
 <meta name="format-detection" content="telephone=no, date=no, address=no, email=no" />
 <meta name="x-apple-disable-message-reformatting" />
 <link href="https://fonts.googleapis.com/css?family=Archivo+Black:ital,wght@0,400" rel="stylesheet" />
 <link href="https://fonts.googleapis.com/css?family=Mona+Sans:ital,wght@0,400;0,500" rel="stylesheet" />
 <title>Untitled</title>
 <!-- Made with Postcards Email Builder by Designmodo -->
 <style>
 html, body { margin: 0 !important; padding: 0 !important; min-height: 100% !important; width: 100% !important; -webkit-font-smoothing: antialiased; }
         * { -ms-text-size-adjust: 100%; }
         #outlook a { padding: 0; }
         .ReadMsgBody, .ExternalClass { width: 100%; }
         .ExternalClass, .ExternalClass p, .ExternalClass td, .ExternalClass div, .ExternalClass span, .ExternalClass font { line-height: 100%; }
         table, td, th { mso-table-lspace: 0 !important; mso-table-rspace: 0 !important; border-collapse: collapse; }
         u + .body table, u + .body td, u + .body th { will-change: transform; }
         body, td, th, p, div, li, a, span { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; mso-line-height-rule: exactly; }
         img { border: 0; outline: 0; line-height: 100%; text-decoration: none; -ms-interpolation-mode: bicubic; }
         a[x-apple-data-detectors] { color: inherit !important; text-decoration: none !important; }
         .body .pc-project-body { background-color: transparent !important; }
                         
 
         @media (min-width: 621px) {
             .pc-lg-hide {  display: none; } 
             .pc-lg-bg-img-hide { background-image: none !important; }
         }
 </style>
 <style>
 @media (max-width: 620px) {
 .pc-project-body {min-width: 0px !important;}
 .pc-project-container, .pc-component {width: 100% !important;}
 .pc-sm-hide {display: none !important;}
 .pc-sm-bg-img-hide {background-image: none !important;}
 .pc-w620-padding-0-0-0-0 {padding: 0px 0px 0px 0px !important;}
 .pc-w620-width-100pc {width: 100% !important;}
 .pc-w620-height-auto {height: auto !important;}
 .pc-w620-font-size-43px {font-size: 43px !important;}
 .pc-w620-line-height-100pc {line-height: 100% !important;}
 .pc-w620-itemsVSpacings-24 {padding-top: 12px !important;padding-bottom: 12px !important;}
 .pc-w620-itemsHSpacings-0 {padding-left: 0px !important;padding-right: 0px !important;}
 .pc-w620-dir-ltr {direction: ltr !important;}
 table.pc-w620-spacing-0-0-0-0 {margin: 0px 0px 0px 0px !important;}
 td.pc-w620-spacing-0-0-0-0,th.pc-w620-spacing-0-0-0-0{margin: 0 !important;padding: 0px 0px 0px 0px !important;}
 .pc-w620-valign-top {vertical-align: top !important;}
 td.pc-w620-halign-center,th.pc-w620-halign-center {text-align: center !important;text-align-last: center !important;}
 table.pc-w620-halign-center {float: none !important;margin-right: auto !important;margin-left: auto !important;}
 img.pc-w620-halign-center {margin-right: auto !important;margin-left: auto !important;}
 .pc-w620-padding-20-20-20-20 {padding: 20px 20px 20px 20px !important;}
 .pc-w620-width-hug {width: auto !important;}
 table.pc-w620-spacing-0-0-12-0 {margin: 0px 0px 12px 0px !important;}
 td.pc-w620-spacing-0-0-12-0,th.pc-w620-spacing-0-0-12-0{margin: 0 !important;padding: 0px 0px 12px 0px !important;}
 .pc-w620-width-270 {width: 270px !important;}
 div.pc-w620-align-center,th.pc-w620-align-center,a.pc-w620-align-center,td.pc-w620-align-center {text-align: center !important;text-align-last: center !important;}
 table.pc-w620-align-center {float: none !important;margin-right: auto !important;margin-left: auto !important;}
 img.pc-w620-align-center {margin-right: auto !important;margin-left: auto !important;}
 .pc-w620-font-size-16px {font-size: 16px !important;}
 .pc-w620-line-height-24px {line-height: 24px !important;}
 .pc-w620-text-align-center {text-align: center !important;text-align-last: center !important;}
 .pc-w620-font-size-18px {font-size: 18px !important;}
 .pc-w620-padding-30-30-30-30 {padding: 30px 30px 30px 30px !important;}
 .pc-w620-itemsVSpacings-20 {padding-top: 10px !important;padding-bottom: 10px !important;}
 .pc-w620-itemsHSpacings-18 {padding-left: 9px !important;padding-right: 9px !important;}
 .pc-w620-valign-middle {vertical-align: middle !important;}
 table.pc-w620-spacing-0-0-24-0 {margin: 0px 0px 24px 0px !important;}
 td.pc-w620-spacing-0-0-24-0,th.pc-w620-spacing-0-0-24-0{margin: 0 !important;padding: 0px 0px 24px 0px !important;}
 .pc-w620-line-height-20px {line-height: 20px !important;}
 .pc-g-ib{display: inline-block !important;}
 .pc-g-b{display: block !important;}
 .pc-g-rb{display: block !important;width: auto !important;}
 .pc-g-wf{width: 100% !important;}
 .pc-g-rpt{padding-top: 0 !important;}
 .pc-g-rpr{padding-right: 0 !important;}
 .pc-g-rpb{padding-bottom: 0 !important;}
 .pc-g-rpl{padding-left: 0 !important;}
 }
 </style>
 <!--[if !mso]><!-- -->
 <style>
 @font-face { font-family: 'Archivo Black'; font-style: normal; font-weight: 400; src: url('https://fonts.gstatic.com/s/archivoblack/v21/HTxqL289NzCGg4MzN6KJ7eW6CYKF-A.woff') format('woff'), url('https://fonts.gstatic.com/s/archivoblack/v21/HTxqL289NzCGg4MzN6KJ7eW6CYKF_g.woff2') format('woff2'); } @font-face { font-family: 'Mona Sans'; font-style: normal; font-weight: 500; src: url('https://fonts.gstatic.com/s/monasans/v3/o-0mIpQmx24alC5A4PNB6Ryti20_6n1iPHjcz6L1SoM-jCpoiyDPA-9U6VQ.woff') format('woff'), url('https://fonts.gstatic.com/s/monasans/v3/o-0mIpQmx24alC5A4PNB6Ryti20_6n1iPHjcz6L1SoM-jCpoiyDPA-9U6VI.woff2') format('woff2'); } @font-face { font-family: 'Mona Sans'; font-style: normal; font-weight: 400; src: url('https://fonts.gstatic.com/s/monasans/v3/o-0mIpQmx24alC5A4PNB6Ryti20_6n1iPHjcz6L1SoM-jCpoiyD9A-9U6VQ.woff') format('woff'), url('https://fonts.gstatic.com/s/monasans/v3/o-0mIpQmx24alC5A4PNB6Ryti20_6n1iPHjcz6L1SoM-jCpoiyD9A-9U6VI.woff2') format('woff2'); }
 </style>
 <!--<![endif]-->
 <!--[if mso]>
    <style type="text/css">
        .pc-font-alt {
            font-family: Arial, Helvetica, sans-serif !important;
        }
    </style>
    <![endif]-->
 <!--[if gte mso 9]>
    <xml>
        <o:OfficeDocumentSettings>
            <o:AllowPNG/>
            <o:PixelsPerInch>96</o:PixelsPerInch>
        </o:OfficeDocumentSettings>
    </xml>
    <![endif]-->
</head>

<body class="body pc-font-alt" style="width: 100% !important; min-height: 100% !important; margin: 0 !important; padding: 0 !important; font-weight: normal; color: #2D3A41; mso-line-height-rule: exactly; -webkit-font-smoothing: antialiased; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; font-variant-ligatures: normal; text-rendering: optimizeLegibility; -moz-osx-font-smoothing: grayscale; background-color: #c4afa8;" bgcolor="#c4afa8">
 <table class="pc-project-body" style="table-layout: fixed; width: 100%; min-width: 600px; background-color: #c4afa8;" bgcolor="#c4afa8" border="0" cellspacing="0" cellpadding="0" role="presentation">
  <tr>
   <td align="center" valign="top" style="width:auto;">
    <table class="pc-project-container" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation">
     <tr>
      <td class="pc-w620-padding-0-0-0-0" style="padding: 20px 0px 20px 0px;" align="left" valign="top">
       <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%">
        <tr>
         <td valign="top">
          <!-- BEGIN MODULE: Reviews -->
          <table width="600" border="0" cellspacing="0" cellpadding="0" role="presentation" align="center" class="pc-component" style="width: 600px; max-width: 600px;">
           <tr>
            <td class="pc-w620-spacing-0-0-0-0" width="100%" border="0" cellspacing="0" cellpadding="0" role="presentation">
             <table width="100%" align="center" border="0" cellspacing="0" cellpadding="0" role="presentation">
              <tr>
               <td valign="top" class="pc-w620-padding-30-30-30-30" style="padding: 50px 30px 60px 30px; height: unset; background-color: #fcedd9;" bgcolor="#fcedd9">
                <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                 <tr>
                  <td align="center" valign="top" style="padding: 0px 0px 40px 0px; height: auto;">
                   <table border="0" cellpadding="0" cellspacing="0" role="presentation" class="pc-w620-width-100pc" width="500" align="center" style="margin-right: auto; margin-left: auto;">
                    <tr>
                     <td valign="top" align="center">
                      <div class="pc-font-alt" style="text-decoration: none;">
                       <div class="pc-w620-font-size-43px pc-w620-line-height-100pc" style="font-size:47px;line-height:100%;text-align:center;text-align-last:center;color:#251b17;font-family:'Archivo Black', Arial, Helvetica, sans-serif;font-style:normal;">
                        <div style="font-family:'Archivo Black', Arial, Helvetica, sans-serif;"><span style="font-family: 'Archivo Black', Arial, Helvetica, sans-serif; font-weight: 400; font-size: 47px; letter-spacing: -0.05em; line-height: 100%;" class="pc-w620-font-size-43px pc-w620-line-height-100pc">Your LMK got a match!</span>
                        </div>
                       </div>
                      </div>
                     </td>
                    </tr>
                   </table>
                  </td>
                 </tr>
                </table>
                <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                 <tr>
                  <td class="pc-w620-spacing-0-0-0-0" align="center">
                   <table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                    <tr>
                     <td valign="top">
                      <table class="pc-width-fill pc-w620-dir-ltr" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                       <tbody>
                        <tr>
                         <td class="pc-g-rpt pc-g-rpb pc-w620-itemsVSpacings-24" align="center" valign="middle" style="width: 100%; padding-top: 0px; padding-bottom: 0px;" dir="ltr">
                          <table class="pc-w620-width-hug" style="border-collapse: separate; border-spacing: 0; width: 100px;" border="0" cellpadding="0" cellspacing="0" role="presentation">
                           <tr>
                            <td class="pc-w620-padding-20-20-20-20 pc-w620-halign-center pc-w620-valign-top" align="center" valign="middle" style="padding: 30px 30px 30px 30px; height: auto; background-color: #ffe8b4; border-radius: 14px 14px 14px 14px; border-top: 2px solid #5b2e1c; border-right: 2px solid #5b2e1c; border-bottom: 2px solid #5b2e1c; border-left: 2px solid #5b2e1c;">
                             <table class="pc-w620-halign-center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                              <tr>
                               <td class="pc-w620-halign-center" align="center" valign="top">
                                <table class="pc-w620-halign-center pc-w620-width-270" width="320" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation">
                                 <tr>
                                  <td class="pc-w620-spacing-0-0-12-0" valign="top" style="padding: 0px 0px 12px 0px; height: auto;">
                                   <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%" align="center">
                                    <tr>
                                     <td valign="top" class="pc-w620-align-center" align="center">
                                      <div class="pc-font-alt pc-w620-align-center" style="text-decoration: none;">
                                       <div class="pc-w620-font-size-16px pc-w620-line-height-24px" style="font-size:18px;line-height:26px;text-align:center;text-align-last:center;color:#5b2e1c;font-family:'Mona Sans', Arial, Helvetica, sans-serif;font-style:normal;letter-spacing:0px;">
                                        <div style="font-family:'Mona Sans', Arial, Helvetica, sans-serif;"><span style="font-family: 'Mona Sans', Arial, Helvetica, sans-serif; font-weight: 400; font-size: 18px; line-height: 26px;" class="pc-w620-font-size-16px pc-w620-line-height-24px">From ${source}:</span>
                                        </div>
                                       </div>
                                      </div>
                                     </td>
                                    </tr>
                                   </table>
                                  </td>
                                 </tr>
                                </table>
                               </td>
                              </tr>
                              <tr>
                               <td class="pc-w620-halign-center" align="center" valign="top">
                                <table class="pc-w620-halign-center pc-w620-width-100pc" width="250" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation">
                                 <tr>
                                  <td class="pc-w620-spacing-0-0-0-0" valign="top" style="padding: 0px 0px 12px 0px; height: auto;">
                                   <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%" align="center">
                                    <tr>
                                     <td valign="top" class="pc-w620-align-center" align="center">
                                      <div class="pc-font-alt pc-w620-align-center" style="text-decoration: none;">
                                       <div class="pc-w620-font-size-18px" style="font-size:20px;line-height:100%;text-align:center;text-align-last:center;color:#5b2e1c;font-family:'Archivo Black', Arial, Helvetica, sans-serif;font-style:normal;">
                                        <div style="font-family:'Archivo Black', Arial, Helvetica, sans-serif;" class="pc-w620-text-align-center"><a href="${link}" target="_blank" rel="noreferrer" style="text-decoration:none;color:inherit;color: rgb(91, 46, 28); font-family: 'Archivo Black', Arial, Helvetica, sans-serif;"><span style="font-family: 'Archivo Black', Arial, Helvetica, sans-serif; font-weight: 400; font-size: 20px; line-height: 100%; letter-spacing: -0.05em; text-decoration: underline;" class="pc-w620-font-size-18px">${headline}</span></a>
                                        </div>
                                       </div>
                                      </div>
                                     </td>
                                    </tr>
                                   </table>
                                  </td>
                                 </tr>
                                </table>
                               </td>
                              </tr>
                             </table>
                            </td>
                           </tr>
                          </table>
                         </td>
                        </tr>
                       </tbody>
                      </table>
                     </td>
                    </tr>
                   </table>
                  </td>
                 </tr>
                </table>
               </td>
              </tr>
             </table>
            </td>
           </tr>
          </table>
          <!-- END MODULE: Reviews -->
         </td>
        </tr>
        <tr>
         <td valign="top">
          <!-- BEGIN MODULE: Footer -->
          <table width="600" border="0" cellspacing="0" cellpadding="0" role="presentation" align="center" class="pc-component" style="width: 600px; max-width: 600px;">
           <tr>
            <td class="pc-w620-spacing-0-0-0-0" width="100%" border="0" cellspacing="0" cellpadding="0" role="presentation">
             <table width="100%" align="center" border="0" cellspacing="0" cellpadding="0" role="presentation">
              <tr>
               <td valign="top" class="pc-w620-padding-30-30-30-30" style="padding: 30px 30px 40px 30px; height: unset; background-color: #5b2e1c;" bgcolor="#5b2e1c">
                <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                 <tr>
                  <td align="center" valign="top" style="padding: 0px 0px 40px 0px; height: auto;">
                   <table border="0" cellpadding="0" cellspacing="0" role="presentation" class="pc-w620-width-100pc" width="500" align="center" style="margin-right: auto; margin-left: auto;">
                    <tr>
                     <td valign="top" align="center">
                      <div class="pc-font-alt" style="text-decoration: none;">
                       <div class="pc-w620-font-size-43px pc-w620-line-height-100pc" style="font-size:47px;line-height:100%;text-align:center;text-align-last:center;color:#ffffff;font-family:'Archivo Black', Arial, Helvetica, sans-serif;font-style:normal;">
                        <div style="font-family:'Archivo Black', Arial, Helvetica, sans-serif;"><span style="font-family: 'Archivo Black', Arial, Helvetica, sans-serif; font-weight: 400; font-size: 47px; letter-spacing: -0.05em; line-height: 100%;" class="pc-w620-font-size-43px pc-w620-line-height-100pc">Want to make another?</span>
                        </div>
                       </div>
                      </div>
                     </td>
                    </tr>
                   </table>
                  </td>
                 </tr>
                </table>
                <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                 <tr>
                  <td class="pc-w620-spacing-0-0-24-0 pc-w620-valign-middle pc-w620-align-center" align="center" style="padding: 0px 0px 30px 0px;">
                   <table class="pc-w620-align-center" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation">
                    <tr>
                     <td style="width:unset;" valign="top">
                      <table class="pc-width-hug pc-w620-halign-center" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation">
                       <tbody>
                        <tr>
                         <td class="pc-g-rpt pc-g-rpb pc-w620-itemsVSpacings-20" valign="top" style="padding-top: 0px; padding-bottom: 0px;">
                          <table border="0" cellpadding="0" cellspacing="0" role="presentation">
                           <tr>
                            <td class="pc-w620-halign-center pc-w620-valign-top" align="left" valign="top">
                             <table class="pc-w620-halign-center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                              <tr>
                               <td class="pc-w620-halign-center" align="left" valign="top">
                                <table border="0" cellpadding="0" cellspacing="0" role="presentation" class="pc-w620-halign-center" align="left">
                                 <tr>
                                  <td valign="top" class="pc-w620-align-center" align="left">
                                   <a class="pc-font-alt pc-w620-align-center" href="https://postcards.email/" target="_blank" style="text-decoration: none;">
                                    <span class="pc-w620-font-size-16px pc-w620-line-height-20px" style="font-size:18px;line-height:24px;text-align:left;text-align-last:left;color:#ffffff;font-family:'Mona Sans', Arial, Helvetica, sans-serif;font-style:normal;letter-spacing:0px;display:inline-block;vertical-align:top;"><span style="font-family:'Mona Sans', Arial, Helvetica, sans-serif;display:inline-block;" class="pc-w620-text-align-center"><span style="font-family: 'Mona Sans', Arial, Helvetica, sans-serif; font-weight: 500; font-size: 18px; line-height: 24px;" class="pc-w620-font-size-16px pc-w620-line-height-20px">Get the app today!</span>
                                    </span>
                                    </span>
                                   </a>
                                  </td>
                                 </tr>
                                </table>
                               </td>
                              </tr>
                             </table>
                            </td>
                           </tr>
                          </table>
                         </td>
                        </tr>
                       </tbody>
                      </table>
                     </td>
                    </tr>
                   </table>
                  </td>
                 </tr>
                </table>
                <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                 <tr>
                  <td class="pc-w620-spacing-0-0-24-0" align="center" valign="top" style="padding: 0px 0px 30px 0px; height: auto;">
                   <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%" style="margin-right: auto; margin-left: auto;">
                    <tr>
                     <td valign="top" align="center">
                      <div class="pc-font-alt" style="text-decoration: none;">
                       <div style="font-size:15px;line-height:24px;text-align:center;text-align-last:center;color:#ffffff;font-family:'Mona Sans', Arial, Helvetica, sans-serif;font-style:normal;letter-spacing:0px;">
                        <div style="font-family:'Mona Sans', Arial, Helvetica, sans-serif;"><span style="font-family: 'Mona Sans', Arial, Helvetica, sans-serif; font-weight: 400; font-size: 15px; line-height: 24px;">You're welcome to </span><a href="https://postcards.email/" target="_blank" rel="noreferrer" style="text-decoration:none;color:inherit;color: rgb(255, 255, 255); font-family: 'Mona Sans', Arial, Helvetica, sans-serif;"><span style="font-family: 'Mona Sans', Arial, Helvetica, sans-serif; font-weight: 400; font-size: 15px; line-height: 24px; text-decoration: underline;">unsubscribe</span></a><span style="font-family: 'Mona Sans', Arial, Helvetica, sans-serif; font-weight: 400; font-size: 15px; line-height: 24px;"> at any time; Just head to settings in the app!</span>
                        </div>
                       </div>
                      </div>
                     </td>
                    </tr>
                   </table>
                  </td>
                 </tr>
                </table>
               </td>
              </tr>
             </table>
            </td>
           </tr>
          </table>
          <!-- END MODULE: Footer -->
         </td>
        </tr>
 </table>
</body>

</html>


    `,
  };
};

const sendEmail = async (target: string, email: EmailData) => {
  const { data, error } = await resend.emails.send({
    from: "LMK <noreply@beeplystudios.com>",
    to: [target],
    ...email,
  });

  if (error) {
    return console.error({ error });
  }

  console.log({ data });
};

const emailData = MatchEmail(
  "New AI Happens",
  "New AI model released",
  "https://example.com/ai-model",
  "TechCrunch"
);
sendEmail("aramie.ewen@gmail.com", emailData);
