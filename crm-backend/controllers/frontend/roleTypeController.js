const roleModel = require("../../models/role");

/* -------------Get All Roles------------ */
const getUserAllRole = async (req, res) => {
  try {
    const getAllRoles = await roleModel.find();
    if (getAllRoles) {
      return res.status(200).json({
        responsecode: 200,
        data: getAllRoles,
        success: true,
      });
    } else {
      return res.status(400).json({
        responsecode: 400,
        message: "No role found",
        success: false,
      });
    }
  } catch (error) {
    console.log("this is get all roles error", error);
    return res.status(400).send({ msg: error });
  }
};
/* -------------Get All Roles End------------ */

module.exports = {
  getUserAllRole,
};
