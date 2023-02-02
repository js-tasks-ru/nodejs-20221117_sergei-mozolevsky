const Category = require('../models/Category')
const mapCategory = require('../mappers/category')

module.exports.categoryList = async function categoryList(ctx, next) {
  const categories = await Category.find();

  const resCategories = {
    categories: categories.map(mapCategory)
  }

 ctx.body = resCategories

};
