const FaqModel = require("../../models/faq");

const getFaqList = async (req, res) => {
   try {
      const { query } = req;
      const { limit, page } = query;

      let condition = {
         $and: []
      };
      condition.$and.push({
         isDeleted: false,
         status: true
      });
      const faqData = await FaqModel.find(condition).limit(parseInt(limit) || 10)
         .skip(((page || 1) - 1) * (limit || 10)).sort({ order: 1 });

      const faqDataCount = await FaqModel.countDocuments(condition)
      return res.status(200).json({
         data: faqData,
         totalFaq: faqDataCount,
         success: true
      })
   } catch (error) {
      res.status(500).json({
         message: error.message ? error.message : "Unexpected error occure.",
         success: false
      });
   }
}
module.exports = {
   getFaqList
};
