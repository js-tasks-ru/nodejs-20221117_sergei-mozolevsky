const Product = require('../models/Product');
const ObjectId = require('mongoose').Types.ObjectId;
const mapProduct = require('../mappers/product')


module.exports.productsBySubcategory = async function productsBySubcategory(ctx, next) {
  const {subcategory} = ctx.query;

  if (!subcategory) return next();

  const products = await Product.find({'subcategory': ObjectId(subcategory)})

  const res = {
    products: products.map(mapProduct)
  }

  ctx.body = res
};

module.exports.productList = async function productList(ctx, next) {

  const products = await Product.find()

  const res = {
    products: products.map(mapProduct)
  }

  ctx.body = res
};

module.exports.productById = async function productById(ctx, next) {

  const {id} = ctx.params
  let productId

  try {
    productId = ObjectId(id)
  } catch(err) {
    throw ({
      status: 400,
      message: 'Id must be a string of 12 bytes or a string of 24 hex characters or an integer'
    })
  }

  const product = await Product.findById(productId)

  if (!product) {
    ctx.status = 404;
    return;
  }

  ctx.body = {
    product: mapProduct(product)
  }
};

