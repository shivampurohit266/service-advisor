const Inspection = require("../../models/inspection");
const commonValidation = require("../../common");
const mongoose = require("mongoose");
const { validationResult } = require("express-validator/check");
const fs = require("fs");
const pdf = require("html-pdf");
const path = require("path");
const __basedir = path.join(__dirname, "../../public");
const { resizeImage, imagePath } = require("../../common/imageThumbnail");
const types = {
  "/": "jpg",
  i: "png",
  R: "gif",
  U: "webp",
  t: "jpeg",
  f: "pdf"
};
/**
*
*/
const imageUpload = async (req, res) => {
  try {
    const { files } = req;
    let imgData = files;
    /* Section1-img upload on aws s3 */
    let imageData = [];
    let images = "";
    console.log("$$$$$$$$$$$$$$$", imgData);

    for (let x = 0; x < imgData.length; x++) {
      if (imgData[x].filename && imgData[x].filename !== "") {
        let isNotBase64 = imgData[x].path.split("https");
        if (
          (imgData[x].path !== undefined || imgData[x].path !== "") &&
          !isNotBase64[1]
        ) {

          let fileName = [
            imgData[x].filename
          ].join("");
          var originalImagePath = path.join(__basedir, "inspection-img", fileName);
          let inspectionImg = await imagePath(originalImagePath, fileName, "inspection_img");
          images = inspectionImg;
          if (images) {
            fs.unlinkSync(originalImagePath);
          }
        } else if (isNotBase64[1]) {
          images = imgData[x].path;
        }
        imageData[x] = images;
        images = "";
      } else {
        imageData[x] = imgData[x].path
      }
    }
    return res.status(200).json({
      images: imageData,
      message: "Successfully uploaded image."
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: error.message ? error.message : "Unexpected error occure.",
      success: false
    });
  }
};
/* get order number */
const creteNewInspection = async (req, res) => {
  const { body, currentUser } = req;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: commonValidation.formatValidationErr(errors.mapped(), true),
      success: false
    });
  }
  try {
    let result = [];
    let inspectionContent;
    for (let index = 0; index < body.inspection.length; index++) {
      const element = body.inspection[index];
      let inspectionItems = [];
      for (let index = 0; index < element.items.length; index++) {
        const inspection = element.items[index];
        let S3ImapectionImg = [],
          S3ImapectionImgThumb = [];
        for (
          let index = 0;
          index < inspection.itemImagePreview.length;
          index++
        ) {
          const inspectionImage = inspection.itemImagePreview[index];
          let inspectionImageUrl = [];
          if (typeof inspectionImage === "string") {
            inspectionImageUrl = inspectionImage.split("https");
          }
          let fileName,
            originalImagePath,
            inspectionImageThumb,
            inspectionImageOriginal,
            fileData;
          if (!inspectionImageUrl[1] || inspectionImageUrl[1] === "undefined") {
            const base64Image = inspectionImage.dataURL.replace(
              /^data:image\/\w+;base64,/,
              ""
            );
            var buf = new Buffer.from(base64Image, "base64");
            const type = types[base64Image.charAt(0)];
            fileName = [inspectionImage.name].join("");
            originalImagePath = path.join(
              __basedir,
              "inspection-img",
              fileName
            );
            fileData = fs.writeFileSync(originalImagePath, buf);
            var thumbnailImagePath = path.join(
              __basedir,
              "inspection-img-thumb",
              fileName
            );
            //console.log("$$$$$$$$$$$$$$$", inspectionImage.name.split('.'), type);
            await resizeImage(originalImagePath, thumbnailImagePath, 300);
            inspectionImageThumb = await imagePath(
              thumbnailImagePath,
              "Imspection-image-thumb",
              "inpection-thumbnail"
            );
            inspectionImageOriginal = await imagePath(
              originalImagePath,
              "Imspection-image",
              "inpection"
            );
            S3ImapectionImgThumb.push(inspectionImageThumb);
            S3ImapectionImg.push(inspectionImageOriginal);
          } else {
            S3ImapectionImgThumb.push(inspectionImage);
            S3ImapectionImg.push(inspectionImage);
          }
          if (
            S3ImapectionImgThumb &&
            S3ImapectionImg &&
            !inspectionImageUrl[1]
          ) {
            fs.unlinkSync(originalImagePath);
            fs.unlinkSync(thumbnailImagePath);
          }
        }
        inspectionItems.push({
          aprovedStatus: inspection.aprovedStatus,
          color: inspection.color,
          itemImage: S3ImapectionImg,
          itemImagePreview: S3ImapectionImg,
          name: inspection.name,
          note: inspection.note
        });
      }
      const inspectionDataModal = {
        inspectionName: element.inspectionName,
        items: inspectionItems,
        isTemplate: false,
        userId: currentUser.id,
        parentId: currentUser.parentId ? currentUser.parentId : currentUser.id,
        status: true,
        isDeleted: false
      };
      inspectionContent = new Inspection(inspectionDataModal);
      const inspecResult = await inspectionContent.save();
      result.push(inspecResult);
    }
    if (result) {
      return res.status(200).json({
        message: `${body.inspection.length} Inspection added successfully!`,
        data: result,
        success: true
      });
    }
  } catch (error) {
    console.log("this is create inspection error", error);
    return res.status(500).json({
      message: error.message ? error.message : "Unexpected error occure.",
      success: false
    });
  }
};
/* get Inpection Data */
const getInspectionData = async (req, res) => {
  const { query, currentUser } = req;
  try {
    const limit = parseInt(query.limit || 100);
    const page = parseInt(query.page || 1);
    const offset = page < 1 ? 0 : (page - 1) * limit;
    const id = currentUser.id;
    const isTemplate = query.isTemplate;
    const searchValue = query.search;
    const parentId = currentUser.parentId || currentUser.id;
    let condition = {};
    condition["$and"] = [
      {
        $or: [
          {
            parentId: mongoose.Types.ObjectId(id)
          },
          {
            parentId: mongoose.Types.ObjectId(parentId)
          }
        ]
      },
      {
        $or: [
          {
            isDeleted: {
              $exists: false
            }
          },
          {
            isDeleted: false
          }
        ]
      }
    ];
    if (searchValue) {
      condition["$and"].push({
        $or: [
          {
            inspectionName: {
              $regex: new RegExp(searchValue.trim(), "i")
            }
          }
        ]
      });
    }
    if (typeof isTemplate !== "undefined") {
      condition["$and"].push({ isTemplate: true });
    }
    const inspection = await Inspection.find(condition)
      .skip(offset)
      .limit(limit);
    const total = await Inspection.countDocuments(condition);
    return res.status(200).json({
      responsecode: 200,
      inspection,
      total,
      success: true
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message ? error.message : "Unexpected error occure.",
      success: false
    });
  }
};
/* inpection as template */
const inspectionTemplate = async (req, res) => {
  const { body, currentUser } = req;
  try {
    let result = [];
    for (let index = 0; index < body.length; index++) {
      const element = body[index];
      const inspection = await Inspection.findById(element._id);
      if (inspection) {
        const inspectionUpdate = await Inspection.findByIdAndUpdate(
          mongoose.Types.ObjectId(inspection._id),
          {
            $set: {
              isDeleted: element.isDeleted
            }
          }
        );
        return res.status(200).json({
          message: "Template deleted successfully!",
          success: true
        });
      } else {
        let inspectionItems = [];
        for (let index = 0; index < element.items.length; index++) {
          const inspection = element.items[index];
          inspectionItems.push({
            aprovedStatus: inspection.aprovedStatus,
            color: inspection.color,
            itemImage: [],
            itemImagePreview: [],
            name: inspection.name,
            note: inspection.note
          });
        }
        const inspectionDataModal = {
          inspectionName: element.inspectionName,
          items: inspectionItems,
          isTemplate: element.isTemplate,
          userId: currentUser.id,
          parentId: currentUser.parentId
            ? currentUser.parentId
            : currentUser.id,
          status: true,
          isDeleted: false
        };
        inspectionContent = new Inspection(inspectionDataModal);
        const inspecResult = await inspectionContent.save();
        result.push(inspecResult);
      }
      if (result) {
        return res.status(200).json({
          message: `${body.length} Inspection added to template successfully!`,
          data: result,
          success: true
        });
      }
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message ? error.message : "Unexpected error occure.",
      success: false
    });
  }
};
/* generate PDF document */
const generatePdfDoc = async (req, res) => {
  const { body } = req;
  try {
    const fileName = ["file.pdf"].join("");

    const config = {
      // Papersize Options: http://phantomjs.org/api/webpage/property/paper-size.html
      format: "A4", // allowed units: A3, A4, A5, Legal, Letter, Tabloid
      orientation: "portrait", // portrait or landscape

      httpHeaders: {
        // e.g.
        ContentType: "application/pdf",
        ContentDisposition: "inline",
        fileName: "invoice.pdf"
      },
      contentType: "application/pdf",
      contentDisposition: "inline",
      // Page options
      border: {
        top: "15px", // default is 0, units: mm, cm, in, px
        right: "15px",
        bottom: "15px",
        left: "15px"
      },

      base: `file://${path.join(__basedir, "css", "style.css")}`,
      header: {
        height: "35mm"
      },
      footer: {
        height: "30px",
        contents: {
          default:
            '<div style="color: #444;text-align: center;padding-top:10px;font-size:11px;border-top:1px solid #ccc;"><span style="float:left;">{{page}}<span>/</span>{{pages}}</span><span>Powered By Serviceadvisor.io</span></div>'
        }
      }
    };
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
    //console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$", htmlBody);

    const originalPdfPath = path.join(__basedir, "inspection-pdf", fileName);
    fs.writeFileSync(originalPdfPath);
    pdf
      .create(htmlBody, config)
      .toFile(originalPdfPath, async function (err, file) {
        if (err) {
          return res.status(400).json({
            err,
            success: false
          });
        }
        const pdfURL = await imagePath(
          file.filename,
          body.isInvoice === 'true'?
          `OrderId(#${body.orderId})-invoice-pdf.pdf`:
          `OrderId(#${body.orderId})-inpection-pdf.pdf`,
          "pdf-file");
        if (pdfURL) {
          fs.unlinkSync(originalPdfPath);
        }
        return res.status(200).json({
          data: pdfURL,
          success: true
        });
      });
  } catch (error) {
    return res.status(500).json({
      message: error.message ? error.message : "Unexpected error occure.",
      success: false
    });
  }
};
module.exports = {
  creteNewInspection,
  getInspectionData,
  inspectionTemplate,
  generatePdfDoc,
  imageUpload
};
