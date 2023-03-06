const jwt = require("jsonwebtoken");

const userModel = require("../../models/user");
const roleModel = require("../../models/role");
const { validationResult } = require("express-validator/check");
const commonValidation = require("../../common");
const commonSmtp = require("../../common/index");
const commonCrypto = require("../../common/crypto");
const { otherMessage } = require("../../common/validationMessage");
const { Email, AvailiableTemplates } = require("../../common/Email");
const moment = require("moment");
const fs = require("fs");
const path = require("path");
const __basedir = path.join(__dirname, "../../public");
const { resizeImage, imagePath } = require("../../common/imageThumbnail");
const mongoose = require("mongoose");
const request = require('request')

const signUp = async (req, res) => {
  try {
    const confirmationNumber = new Date().valueOf();
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        message: commonValidation.formatValidationErr(errors.mapped(), true).replace("<br>", " "),
        success: false
      });
    }
    const planExpDate = moment(new Date(), "DD-MM-YYYY").add(30, 'days');

    const roleType = await roleModel.findOne({
      userType: new RegExp("sub-admin", "i")
    });
    console.log("roletype",roleType)
    let $data = req.body;
    $data.roleType = roleType._id;
    $data.permissions =
      typeof roleType.permissionObject[0] === "object"
        ? roleType.permissionObject[0]
        : roleType.permissionObject;
    $data.firstTimeUser = true;
    $data.loggedInIp = commonSmtp.getIpAddress(req);
    var salt = commonCrypto.generateSalt(6);
    $data.salt = salt;
    $data.password = commonCrypto.hashPassword($data.password, salt);
    $data.userSideActivationValue = confirmationNumber;
    $data.subdomain = $data.workspace;
    $data.shopLogo = $data.companyLogo;
    $data.planExiprationDate = planExpDate
    $data.website = $data.companyWebsite;
    let result = await userModel($data).save();
    const emailVar = new Email(req);
    await emailVar.setTemplate(AvailiableTemplates.SIGNUP_CONFIRMATION, {
      firstName: result.firstName,
      lastName: result.lastName,
      email: result.email,
      userId: result._id,
      userSideActivationValue: confirmationNumber
    });
    await emailVar.sendEmail(result.email);

    return res.status(200).json({
      message: otherMessage.confirmMessage,
      user: result._id,
      success: true
    });
  } catch (error) {
    res.status(500).json({
      message: error.message ? error.message : "Unexpected error occure.",
      success: false
    });
  }
};
/* Resend Cofirmation Link */
const resendConfirmationLink = async (req, res) => {
  try {
    let {
      firstName,
      lastName,
      email,
      _id,
      userSideActivationValue,
      userSideActivation
    } = await userModel.findById(req.body.id);
    if (userSideActivation === false && userSideActivationValue !== "") {
      const emailVar = new Email(req);
      await emailVar.setTemplate(AvailiableTemplates.SIGNUP_CONFIRMATION, {
        userId: _id,
        firstName,
        lastName,
        email,
        userSideActivationValue
      });
      await emailVar.sendEmail(email);
      return res.status(200).json({
        message: otherMessage.confirmMessage,
        user: _id,
        success: true
      });
    } else {
      return res.status(200).json({
        message: "You have already confirmed your account.",
        user: _id,
        success: true
      });
    }
  } catch (error) { }
};
/*  */
const confirmationSignUp = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        message: commonValidation.formatValidationErr(errors.mapped(), true),
        success: false
      });
    }
    let data = req.body;
    var userData = await userModel.findOne({
      $and: [
        { _id: data.userId },
        { userSideActivation: false },
        { userSideActivationValue: data.activeValue }
      ]
    });
    if (userData) {
      let roleUpdate = await userModel.updateOne(
        {
          _id: userData._id
        },
        {
          $set: {
            userSideActivation: true,
            userSideActivationValue: ""
          }
        }
      );
      if (roleUpdate) {
        const emailVar = new Email(req);
        await emailVar.setTemplate(AvailiableTemplates.SIGNUP, {
          firstName: userData.firstName,
          lastName: userData.lastName
        });
        await emailVar.sendEmail(userData.email);
        res.status(200).json({
          message: userData,
          success: true
        });
      } else {
        res.status(401).json({
          message: "Some thing Went Wrong",
          success: false
        });
      }
    } else {
      res.status(401).json({
        message: "User already exist.",
        success: false
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message ? error.message : "Unexpected error occure.",
      success: false
    });
  }
};
const loginApp = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await userModel
      .findOne({
        $and: [
          { normalizedEmail: email },
          { $or: [{ isDeleted: { $exists: false } }, { isDeleted: false }] }
        ]
      })
      .populate("planId");
    if (result === null) {
      // eslint-disable-next-line no-throw-literal
      throw {
        code: 400,
        message:
          "Please enter valid email or password.",
        success: false
      };
    }
    if (!result.status) {
      // eslint-disable-next-line no-throw-literal
      throw {
        code: 400,
        message: "Your account access has been deactivated from the Admin,Please contact the Administrator.",
        success: false
      };
    }
    console.log("userSideActivation",result.userSideActivation);
    
    if (!result.userSideActivation) {
      // eslint-disable-next-line no-throw-literal
      throw {
        code: 400,
        message: "Kindly Verify your Account and try to Login.",
        success: false
      };
    }
    if (!commonCrypto.verifyPassword(result.password, password, result.salt)) {
      // eslint-disable-next-line no-throw-literal
      throw {
        code: 400,
        message: "Please enter correct email or password.",
        success: false
      };
    }
    let companyData;
    if (
      result.parentId &&
      mongoose.Types.ObjectId(result._id) !==
      mongoose.Types.ObjectId(result.parentId)
    ) {
      companyData = await userModel.findOne({
        _id: result.parentId
      });
    }
    await userModel.updateOne(
      {
        _id: result._id
      },
      {
        $set: {
          loggedInIp: commonSmtp.getIpAddress(req),
          loggedInAt: new Date()
        }
      }
    );
    var token = jwt.sign(
      {
        id: result._id,
        randomKey: commonCrypto.generateSalt(8),
        email: result.email,
        firstName: result.firstName,
        lastName: result.lastName,
        parentId: result.parentId,
        subdomain: result.subdomain,
        planId: result.planId
      },
      commonCrypto.secret,
      {
        expiresIn: 86400
      }
    );
    const isPlanExpiered = moment(result.planExiprationDate).isSameOrBefore(new Date(), 'day');
    if (isPlanExpiered && result.isInTrialPeriod) {
      await userModel.findByIdAndUpdate(result._id, {
        isInTrialPeriod: false,
        planId: null
      })
    }
    return res.status(200).json({
      responseCode: 200,
      data: result,
      companyData: companyData || {},
      tokenExpire: moment() + 86400,
      token: token,
      message: "Successfully Login",
      success: true
    });
  } catch (error) {
    res.status(error.code || 500).json({
      message: error.message ? error.message : "Unexpected error occure.",
      success: false
    });
  }
};
/* -----------------User Forgot Password-------------- */
const userForgotPassword = async (req, res) => {
  const { body } = req;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: commonValidation.formatValidationErr(errors.mapped(), true),
      success: false
    });
  }
  try {
    const userData = await userModel.findOne({ email: body.email });
    if (!userData) {
      return res.status(400).json({
        responsecode: 400,
        message: "Email not registered with us.",
        success: false
      });
    }
    const encryptedUserId = commonCrypto.encrypt(userData.id);
    const encrypteUserEmail = commonCrypto.encrypt(userData.email);
    const encrypteVerifyToken = commonCrypto.encrypt(
      userData.email + userData.id
    );
    const emailVar = new Email(req);
    await emailVar.setTemplate(AvailiableTemplates.FORGET_PASSWORD, {
      resetPageUrl: req.headers.host,
      fullName: userData.firstName + " " + userData.lastName,
      email: encrypteUserEmail,
      userId: encryptedUserId,
      verifyToken: encrypteVerifyToken
    });
    await userModel.update(
      {
        email: userData.email
      },
      {
        verifyToken: encrypteVerifyToken
      }
    );
    await emailVar.sendEmail(body.email);
    return res.status(200).json({
      responsecode: 200,
      message:
        "Reset password link have been send successfully to your registered email address.",
      success: true
    });
  } catch (error) {
    console.log("this is forgot password error", error);
    return res.status(500).json({
      message: error.message ? error.message : "Unexpected error occure.",
      success: false
    });
  }
};
/* -----------------User Verify Link-------------- */
const userVerifyLink = async (req, res) => {
  const { body } = req;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: commonValidation.formatValidationErr(errors.mapped(), true),
      success: false
    });
  }
  try {
    const decryptedUserId = commonCrypto.decrypt(body.verification);
    const decryptedUserEmail = commonCrypto.decrypt(body.user);
    const userData = await userModel.findOne({
      email: decryptedUserEmail,
      _id: decryptedUserId,
      verifyToken: body.token
    });
    if (!userData) {
      return res.status(400).json({
        responsecode: 400,
        message: "Your session has been expired.",
        success: false
      });
    }
    return res.status(200).json({
      message: "Link verified successfully!",
      data: userData,
      success: true
    });
  } catch (error) {
    console.log("this is verify link error", error);
    return res.status(500).json({
      message: error.message ? error.message : "Unexpected error occure.",
      success: false
    });
  }
};

/* -----------------User Reset password-------------- */
const userResetpassword = async (req, res) => {
  const { body } = req;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: commonValidation.formatValidationErr(errors.mapped(), true),
      success: false
    });
  }
  try {
    const decryptedUserEmail = commonCrypto.decrypt(body.user);
    const userData = await userModel.findOne({ email: decryptedUserEmail });
    if (!userData) {
      return res.status(400).json({
        responsecode: 400,
        message: "Email not registered.",
        success: false
      });
    }
    var salt = commonCrypto.generateSalt(6);
    body.salt = salt;
    const encryptedUserpassword = commonCrypto.hashPassword(
      body.password,
      salt
    );
    if (!userData.verifyToken) {
      return res.status(400).json({
        responsecode: 400,
        message: "Your session has been expired.",
        success: false
      });
    }
    const result = await userModel.findByIdAndUpdate(
      {
        _id: userData.id
      },
      {
        $set: {
          password: encryptedUserpassword,
          salt: body.salt,
          verifyToken: null
        }
      }
    );
    if (result) {
      return res.status(200).json({
        message: "Password updated successfully!",
        success: true
      });
    } else {
      return res.status(400).json({
        responsecode: 400,
        message: "Your session has been expired.",
        success: false
      });
    }
  } catch (error) {
    console.log("this is Reset password error", error);
    return res.status(500).json({
      message: error.message ? error.message : "Unexpected error occure.",
      success: false
    });
  }
};
/* ------------User Company Setup--------------- */
const userCompanySetup = async (req, res) => {
  const { body, currentUser } = req;
  try {
    const userData = await userModel.findById(currentUser.id);
    if (!userData) {
      return res.status(400).json({
        responsecode: 400,
        message: "User not registered",
        success: false
      });
    }
    const comapnyData = {
      companyName: body.companyName,
      website: body.website,
      peopleWork: body.peopleWork,
      serviceOffer: body.servicesOffer,
      vehicleService: body.vehicleServicesOffer,
      firstTimeUser: false
    };
    const companySetup = await userModel.findByIdAndUpdate(
      {
        _id: userData.id
      },
      {
        $set: comapnyData
      }
    );
    if (!companySetup) {
      return res.status(400).json({
        responsecode: 400,
        message: "Error uploding user company details.",
        success: false
      });
    } else {
      return res.status(200).json({
        responsecode: 200,
        message: "User company details uploaded successfully!",
        success: false,
        info: comapnyData
      });
    }
  } catch (error) {
    console.log("this is Company setup error", error);
    return res.status(500).json({
      message: error.message ? error.message : "Unexpected error occure.",
      success: false
    });
  }
};
/* ------------User Company Setup End--------------- */
const types = {
  "/": "jpg",
  i: "png",
  R: "gif",
  U: "webp"
};
/* ---------------User Image Upload---------------- */
const imageUpload = async (req, res) => {
  try {
    const { body, currentUser } = req;
    if (!body.imageData) {
      const companyLogo = await userModel.findByIdAndUpdate(currentUser.id, {
        shopLogo: ""
      });
      if (companyLogo) {
        return res.status(200).json({
          responseCode: 200,
          message: "Company Logo uploaded successfully!",
          success: true,
          shopLogo: ""
        });
      } else {
        return res.status(400).json({
          responseCode: 400,
          message: "Error uploading company logo.",
          success: false
        });
      }
    }
    const isNotBase64 = body.imageData.split("https");
    if (
      (body.imageData !== undefined || body.imageData !== "") &&
      !isNotBase64[1]
    ) {
      const base64Image = body.imageData.replace(
        /^data:image\/\w+;base64,/,
        ""
      );
      var buf = new Buffer.from(base64Image, "base64");
      const type = types[base64Image.charAt(0)];
      const randomConst = Math.floor(Math.random() * 90 + 10);
      const fileName = [
        currentUser.id,
        randomConst,
        "_company_logo.",
        type || "png"
      ].join("");

      var originalImagePath = path.join(__basedir, "images", fileName);
      fs.writeFile(originalImagePath, buf, async err => {
        if (err) {
          throw err;
        }

        var thumbnailImagePath = path.join(
          __basedir,
          "images-thumbnail",
          fileName
        );
        await resizeImage(originalImagePath, thumbnailImagePath, 200);
        /* const imageUploadData = {
          originalImage: ["", "images", fileName].join("/"),
          thumbnailImage: ["", "images-thumbnail", fileName].join("/")
        }; */
        const shopLogo = await imagePath(originalImagePath, "profile-image", "profile-thumb");
        const companyLogo = await userModel.findByIdAndUpdate(currentUser.id, {
          shopLogo: shopLogo
        });
        if (companyLogo) {
          return res.status(200).json({
            responseCode: 200,
            message: "Company Logo uploaded successfully!",
            success: true,
            shopLogo: shopLogo
          });
        } else {
          return res.status(400).json({
            responseCode: 400,
            message: "Error uploading company logo.",
            success: false
          });
        }
      });
    } else if (isNotBase64[1]) {
      return res.status(200).json({
        responseCode: 200,
        message: "Company Logo uploaded successfully!",
        success: true,
        shopLogo: body.imageData
      });
    }
  } catch (error) {
    console.log("**************This is image upload error", error);
    return res.status(400).json({
      responseCode: 400,
      message: "Error while saving file!",
      error: error,
      success: false
    });
  }
};
/* ---------------User Image Upload End---------------- */

/* ----------------User Image Delete-------------------- */
const imageDelete = async (req, res) => {
  try {
    const { body, currentUser } = req;
    if (!body.imageData) {
      return res.status(401).json({
        responseCode: 401,
        message: "Not provided any file to upload!",
        success: false
      });
    }
    if (body.imageData !== undefined || body.imageData !== "") {
      const base64Image = body.imageData.replace(
        /^data:image\/\w+;base64,/,
        ""
      );
      var buf = new Buffer(base64Image, "base64");
      var originalImagePath = __basedir + "/images/" + currentUser.id;
      var thumbnailImagePath =
        __basedir + "/images-thumbnail/" + currentUser.id + "image-thumb";
      fs.unlinkSync(originalImagePath, buf, function (err) {
        if (err) {
          return console.log(err);
        }
        console.log("The file was deleted!");
      });
      fs.unlinkSync(thumbnailImagePath, buf, function (err) {
        if (err) {
          return console.log(err);
        }
        console.log("The file was deleted!");
      });
      const imageUploadData = {
        originalImage: null,
        thumbnailImage: null
      };
      const companyLogo = await userModel.findByIdAndUpdate(
        { _id: currentUser.id },
        {
          shopLogo: imageUploadData
        }
      );
      if (companyLogo) {
        return res.status(200).json({
          responseCode: 200,
          message: "Image deleted successfully!",
          success: true
        });
      } else {
        return res.status(400).json({
          responseCode: 400,
          message: "Error uploading company logo.",
          success: false
        });
      }
    } else {
      return res.status(400).json({
        responsecode: 400,
        message: "Enter valid image.",
        success: false
      });
    }
  } catch (error) {
    console.log("**************This is image upload error", error);
    return res.status(400).json({
      responseCode: 400,
      message: "Error while saving file!",
      error: error,
      success: false
    });
  }
};
/* ----------------User Image Delete End-------------------- */

/*----------------User create by admin------------------ */
const createUser = async (req, res) => {
  try {
    const { currentUser } = req;
    const parentId = currentUser.parentId || currentUser.id;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        message: commonValidation.formatValidationErr(errors.mapped(), true),
        success: false
      });
    }
    const confirmationNumber = new Date().valueOf();
    let $data = req.body;
    $data.firstTimeUser = true;
    $data.userSideActivationValue = confirmationNumber;
    let inserList = {
      ...$data,
      subdomain: currentUser.subdomain,
      companyName: $data.companyName,
      roleType: mongoose.Types.ObjectId($data.roleType),
      parentId: parentId,
      rate: parseFloat($data.rate.replace(/[$,\s]/g, "")).toFixed(2)
    };
    let result = await userModel(inserList).save();
    const emailVar = new Email(req);
    await emailVar.setTemplate(AvailiableTemplates.USER_ADDED_CONFIRMATION, {
      firstName: result.firstName,
      lastName: result.lastName,
      email: result.email,
      userId: result._id,
      userSideActivationValue: confirmationNumber
    });
    await emailVar.sendEmail(result.email);
    if (result) {
      return res.status(200).json({
        message: otherMessage.insertUserMessage,
        success: true
      });
    } else {
      return res.status(400).json({
        result: result,
        message: "Error in inserting user.",
        success: false
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message ? error.message : "Unexpected error occure.",
      success: false
    });
  }
};

/*----------------User create by admin------------------ */
const updateUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        message: commonValidation.formatValidationErr(errors.mapped(), true),
        success: false
      });
    }
    let $data = req.body;

    let inserList = {
      ...$data,
      roleType: mongoose.Types.ObjectId($data.roleType),
      parentId: req.currentUser.id,
      rate: parseFloat($data.rate.replace(/[$,\s]/g, "")).toFixed(2)
    };
    let result = await userModel.findByIdAndUpdate(
      req.params.userId,
      inserList
    );
    return res.status(200).json({
      message: otherMessage.updatedUserMessage,
      data: result,
      success: true
    });
  } catch (error) {
    res.status(500).json({
      message: error.message ? error.message : "Unexpected error occure.",
      success: false
    });
  }
};

/* verify user */
const verfiyUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        message: commonValidation.formatValidationErr(errors.mapped(), true),
        success: false
      });
    }
    let $data = req.body;
    var userData = await userModel.findOne({
      $and: [
        { _id: $data.userId },
        { userSideActivation: false },
        { userSideActivationValue: $data.activeValue }
      ]
    });
    if (userData) {
      let salt = commonCrypto.generateSalt(6);
      let password = commonCrypto.hashPassword($data.password, salt);
      let loggedInIp = commonSmtp.getIpAddress(req);
      let roleUpdate = await userModel.updateOne(
        {
          _id: userData._id
        },
        {
          $set: {
            userSideActivation: true,
            userSideActivationValue: "",
            password: password,
            salt,
            loggedInIp: loggedInIp
          }
        }
      );
      if (roleUpdate) {
        res.status(200).json({
          message: otherMessage.userPasswordCreation,
          success: true
        });
      } else {
        res.status(401).json({
          message: "Some thing Went Wrong",
          success: false
        });
      }
    } else {
      res.status(401).json({
        message: otherMessage.linkExpiration,
        success: false
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message ? error.message : "Unexpected error occure.",
      success: false
    });
  }
};

/* verify user Link*/
const verfiyUserLink = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        message: commonValidation.formatValidationErr(errors.mapped(), true),
        success: false
      });
    }
    let $data = req.body;
    var userData = await userModel.findOne({
      $and: [
        { _id: $data.userId },
        { userSideActivation: false },
        { userSideActivationValue: $data.activeValue }
      ]
    });
    if (userData) {
      res.status(200).json({
        message: "Link verified successfully!",
        success: true
      });
    } else {
      res.status(401).json({
        message: otherMessage.linkExpiration,
        success: false
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message ? error.message : "Unexpected error occure.",
      success: false
    });
  }
};

/* Change password user*/
const changePasswordUser = async (req, res) => {
  const { body, currentUser } = req;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: commonValidation.formatValidationErr(errors.mapped(), true),
      success: false
    });
  }
  try {
    const userData = await userModel.findById(currentUser.id);
    if (
      !commonCrypto.verifyPassword(
        userData.password,
        body.oldPassword,
        userData.salt
      )
    ) {
      // eslint-disable-next-line no-throw-literal
      throw {
        code: 400,
        message: "Old password did not match!",
        success: false
      };
    } else {
      var salt = commonCrypto.generateSalt(6);
      body.salt = salt;
      body.newPassword = commonCrypto.hashPassword(body.newPassword, salt);
      const result = await userModel.findByIdAndUpdate(currentUser.id, {
        $set: {
          password: body.newPassword,
          salt: body.salt
        }
      });
      if (result) {
        return res.status(200).json({
          message: "Password updated successfully!",
          success: true
        });
      }
    }
  } catch (error) {
    res.status(500).json({
      message: error.message ? error.message : "Unexpected error occure.",
      success: false
    });
  }
};
const updateUserData = async (req, res) => {
  try {
    let $data = req.body;
    let currentUser = req.currentUser;
    let inserList = {
      ...$data,
      parentId: currentUser.id,
      updatedAt: Date.now()
    };
    let result = await userModel.findByIdAndUpdate(currentUser.id, inserList);
    return res.status(200).json({
      message: $data.isCompanyProfile ? "Company details updated successfully." : otherMessage.updateUserDataMessage,
      data: result,
      success: true
    });
  } catch (error) {
    res.status(500).json({
      message: error.message ? error.message : "Unexpected error occure.",
      success: false
    });
  }
};
/* 
 */
const enquiryRequesrData = async (req, res) => {

  try {
    const { body } = req;
    const { firstName, lastName, email } = body;
    const data = {
      members: [
        {
          email_address: email,
          status: "subscribed",
          merge_fields: {
            FNAME: firstName,
            LNAME: lastName
          }
        }
      ]
    }

    const postData = JSON.stringify(data);

    const options = {
      url: "https://us5.api.mailchimp.com/3.0/lists/8becffc2f0",
      method: 'POST',
      headers: {
        Authorization: 'auth 79d49a4565f2e2a06f1192923c80d38f-us5'
      },
      body: postData
    }
    request(options, (err, response, body) => {
      if (err) {
        return res.status(400).json({
          message: err
        })
      } else {
        if (response.statusCode === 200) {
          return res.status(200).json({
            message: err
          })
        } else {
          return res.status(400).json({
            message: "Fetched some error during subscribtion!"
          })
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      message: error.message ? error.message : "Unexpected error occure.",
      success: false
    });
  }
};
module.exports = {
  signUp,
  confirmationSignUp,
  loginApp,
  userForgotPassword,
  userVerifyLink,
  userResetpassword,
  userCompanySetup,
  createUser,
  updateUser,
  verfiyUser,
  verfiyUserLink,
  imageUpload,
  imageDelete,
  resendConfirmationLink,
  changePasswordUser,
  updateUserData,
  enquiryRequesrData
};
