const asyncHandler = require('../middlewares/async');
const ErrorResponse = require('../helpers/errorRes');
const User = require('../models/Users');

/**
 * @desc        Register user
 * @route       POST /api/v1/register
 * @access      Public
 */
exports.register = asyncHandler(async (req, res, next) => {
  const user = await User.create(req.body);

  // create token
  const token = user.getSignedJwtToken();

  res.status(200).json({
      success: true,
      token,
  });
})

/**
 * @desc        Login user
 * @route       POST /api/v1/login
 * @access      Public
 */
exports.login = asyncHandler(async (req, res, next) => {
  const {username, password} = req.body;

  // validate email & password
  if (!username || !password) {
      return next(new ErrorResponse('Please provide username and password.', 400));
  }

  // check for user
  const user = await User.findOne({username}).select('+password');

  if (!user) {
      return next(new ErrorResponse('Username or password is incorrect.', 401));
  }

  // check if password matches
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
      return next(new ErrorResponse('Username or password is incorrect.', 401));
  }

  // create token
  const token = user.getSignedJwtToken();

  res.status(200).json({
      success: true,
      token,
  });
})