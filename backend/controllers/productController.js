import asyncHandler from 'express-async-handler';
import Product from '../models/Product.js';

/**
 * @desc    Get all products with search and filter
 * @route   GET /api/products
 * @access  Public
 */
export const getProducts = asyncHandler(async (req, res) => {
  // Extract query parameters
  const {
    search,
    category,
    minPrice,
    maxPrice,
    inStock,
    sort,
    page = 1,
    limit = 12,
  } = req.query;

  // Build query object
  const query = {};

  // Text search (searches in name and description)
  if (search) {
    query.$text = { $search: search };
  }

  // Category filter
  if (category) {
    query.category = category;
  }

  // Price range filter
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }

  // Stock filter
  if (inStock !== undefined) {
    query.inStock = inStock === 'true';
  }

  // Build sort object
  let sortBy = {};
  if (sort) {
    switch (sort) {
      case 'price_asc':
        sortBy = { price: 1 };
        break;
      case 'price_desc':
        sortBy = { price: -1 };
        break;
      case 'name_asc':
        sortBy = { name: 1 };
        break;
      case 'name_desc':
        sortBy = { name: -1 };
        break;
      case 'newest':
        sortBy = { createdAt: -1 };
        break;
      default:
        sortBy = { createdAt: -1 };
    }
  } else {
    sortBy = { createdAt: -1 }; // Default: newest first
  }

  // Pagination
  const pageNum = Number(page);
  const limitNum = Number(limit);
  const skip = (pageNum - 1) * limitNum;

  // Execute query
  const products = await Product.find(query)
    .sort(sortBy)
    .skip(skip)
    .limit(limitNum);

  // Get total count for pagination
  const total = await Product.countDocuments(query);

  res.status(200).json({
    success: true,
    count: products.length,
    total,
    page: pageNum,
    pages: Math.ceil(total / limitNum),
    data: products,
  });
});

/**
 * @desc    Get single product by ID
 * @route   GET /api/products/:id
 * @access  Public
 */
export const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'Product not found',
    });
  }

  res.status(200).json({
    success: true,
    data: product,
  });
});

/**
 * @desc    Create new product
 * @route   POST /api/products
 * @access  Private/Admin
 */
export const createProduct = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    price,
    category,
    brand,
    image,
    inStock,
    stockQuantity,
  } = req.body;

  // Validate required fields
  if (!name || !description || !price || !category) {
    return res.status(400).json({
      success: false,
      message: 'Please provide all required fields (name, description, price, category)',
    });
  }

  const product = await Product.create({
    name,
    description,
    price,
    category,
    brand,
    image: image || '',
    inStock: inStock !== undefined ? inStock : true,
    stockQuantity: stockQuantity || 0,
  });

  res.status(201).json({
    success: true,
    message: 'Product created successfully',
    data: product,
  });
});

/**
 * @desc    Update product
 * @route   PUT /api/products/:id
 * @access  Private/Admin
 */
export const updateProduct = asyncHandler(async (req, res) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'Product not found',
    });
  }

  // Update product with new data
  product = await Product.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true, // Return updated document
      runValidators: true, // Run model validators
    }
  );

  res.status(200).json({
    success: true,
    message: 'Product updated successfully',
    data: product,
  });
});

/**
 * @desc    Delete product
 * @route   DELETE /api/products/:id
 * @access  Private/Admin
 */
export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'Product not found',
    });
  }

  await Product.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    message: 'Product deleted successfully',
    data: {},
  });
});

/**
 * @desc    Get all categories
 * @route   GET /api/products/categories
 * @access  Public
 */
export const getCategories = asyncHandler(async (req, res) => {
  const categories = await Product.distinct('category');

  res.status(200).json({
    success: true,
    count: categories.length,
    data: categories,
  });
});

