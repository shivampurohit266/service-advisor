const pdfHtmlContent = (body) => {
   const htmlBody = `
   <html>
   <head>
     <style>
       @import url("https://fonts.googleapis.com/css?family=Open+Sans:400,600,700,800");
       @import url('https://fonts.googleapis.com/css?family=Roboto:400,500,700,900&display=swap');
       * {
         margin: 0;
         padding: 0;
         zoom:0;
       }
       body {
           font-family:'Roboto', Sans-serif ;
       }
       .pdf-container {
         width:550px;
         margin:auto;
       }
       .invoice {
           float:left;
       }
       .invoice-name
       {
         font-size: 14px;
         padding-bottom:5px;
       }
       .invoice-date
       {
           font-size: 10px;
       }
       .company-name-warp{
         float:right;          
       }
       .company-name
       {
           font-size: 15px;
           font-weight:500;
           text-transform:capitalize;
           padding-top:0px;
           width: 100%;
            display:block;
           text-align: right;
       }
       .company-address{
           font-size: 10px;
           font-weight:400;
           padding-top:5px;
           text-align:right;
           display:block;
            width: 100%;
       }
       .user-details {
           clear: both;
           float: none;
           border: 1px solid #d4d4d4;
           padding: 6px 0px;
           font-size: 14px;
           margin: 10px 0px;
       }
       .width-50{
           width: 50%;
           float:left;
       }
       .user-details-left{
           padding: 0px 6px;
           border-right:2px solid #f0f0f1;
           font-size:11px;
       }
       .user-details-right{
           padding: 0px 10px;
           font-size:11px;
       }
       .user-details-right div{
         display:block;
         width:100%;
       }
       .user-details-right .plateName{
         font-size:9px;
         padding-top:4px;
       }
       .user-email{
           font-size:9px;
           padding-top:4px;
       }
       .clearfix {
           clear:both;
           float:none;
       }
       .invoceTableDesign {
           margin-bottom: 10px;
       }
       .invoceTableTitle{
           background: #dddddd;
           padding: 4px 7px;
           color: #000;
           font-size: 10px;
           font-weight: 500;
           text-transform: capitalize;
       }
       .invoice-table {
           border-left: 1px solid #dddddd;
           width: 100%;
            border-collapse: collapse;
           font-size: 10px;
       }
       .service-title{
           width:250px;
       }
       .invoice-table tr th {
           border-right: 1px solid #dddddd;
           border-bottom: 1px solid #dddddd;
           font-size: 10px;
           color: #000;
           padding: 2px 4px;
           vertical-align: middle;
           text-align: left;
           font-weight: 400;
       }
       .invoice-table tr td{
           border-right: 1px solid #dddddd;
           border-bottom: 1px solid #dddddd;
           font-size: 10px;
           color: #000;
           padding: 2px 4px;
           vertical-align: middle;
           text-align: left;
           font-weight: 400;
       }
       .invoice-table tbody tr:nth-of-type(odd) {
       }
       .invoice-table tr td .parts-name{
           font-size: 10px;
           display: block;
           padding-bottom: 2px;
           font-weight:400;
       }
       .invoice-table tr td .note-text{
           font-size: 10px;
           color: #8a8a8a;
           font-weight:400;
           font-style: italic;
       }
       .total-amount
       {
         background: #f0f0f1;
         padding: 4px;
         color: #000;
         font-weight: 500;
       }
       .total-amount-left{
         float:left;
         width: 380px;
       }
       .epa-price{
         display:inline-block;
         font-size:10px;
         padding-right: 15px;
       }
       .discount-price{
         display:inline-block;
         font-size:10px;
         padding-right: 15px;
       }
       .tax-price{
         display:inline-block;
         font-size:10px;
         padding-right: 15px;
       }
       .service-price{
         width: 150px;
         float:left;
         display: block;
         text-align: right;
         font-size:11px;
         clear:right;
       }
       .order-table{
         width:200px;
         border-collapse: collapse;
         border: 2px solid #ddd;
       }
       table.order-table tr td{
         width: 100px;
         padding: 1px 8px;
         font-size: 12px;
         text-align: right;
       }
       .order-table tr.grand-total td
       {
         font-size: 13px;
         padding: 5px 8px;
       }
       .colon
       {
         padding-right: 0;
         text-align: left;
         float: left;
       }
       .border-bottom{
         border-bottom:2px solid #f0f0f1;
         padding-bottom:10px !important;
       }
       .plus-width{
         width: 10px;
         display: inline-block;
       }
       .order-total-table{
         padding-top:5px;
       }
        table { page-break-inside:auto;page-break-after: auto  }
         tr    { page-break-inside:avoid; page-break-after:auto }
         thead { display:table-header-group }
         tfoot { display:table-footer-group }
     </style>
     <link href=${path.join(__basedir, "css", "style.css")} rel="stylesheet"/>
   </head>
     <body>
       ${body.html}
     </body>
   </html>`;
   return htmlBody
}
module.exports = {
   pdfHtmlContent
}