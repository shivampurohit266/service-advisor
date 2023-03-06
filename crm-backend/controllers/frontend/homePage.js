const HomePageModel = require("../../models/homePage");

/**
 * Api for home page details gates
 */
const getHomePage = async (req, res) => {
    try {
       const data = await HomePageModel.findOne({});
       return res.status(200).json({
          message: "Home page get successfully!",
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
    getHomePage
  };
