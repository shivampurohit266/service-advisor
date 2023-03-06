const SettingsModel = require("../../models/siteSetting");

/**
 *
 */
const getSiteSettings = async (req, res) => {
   try {
      const data = await SettingsModel.findOne({});
      return res.status(200).json({
         message: "Settings list get successfully!",
         data
      });
   } catch (error) {
      console.log(error);
      return res.status(500).json({
         message: error.message ? error.message : "Unexpected error occure.",
         success: false
      });
   }
};

module.exports = {
   getSiteSettings
 };
