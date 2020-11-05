const User = require('../models/User');
const Profile = require('../models/Profile');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middlewares/async');
const { validationResult } = require('express-validator');



// @desc        Get single user light version
// @route       GET api/cw-api/users/light/:userId
// @access      Private
exports.getUserLight = asyncHandler(async (req, res, next) => {
    res.status(200).json(res.advancedResults);
});

// @desc        Get single user extended with room and profile
// @route       GET api/cw-api/users/extended/:userId
// @access      Private
exports.getUserExtended = asyncHandler(async (req, res, next) => {
    res.status(200).json(res.advancedResults);
});

// @desc        Get all users light version
// @route       GET api/cw-api/users/light
// @access      Private
exports.getUsersLight = asyncHandler(async (req, res, next) => {
    res.status(200).json(res.advancedResults);
});

// @desc        Get all users extended with rooms and profiles
// @route       GET api/cw-api/users/extended
// @access      Private
exports.getUsersExtended = asyncHandler(async (req, res, next) => {
    res.status(200).json(res.advancedResults);
});

// //update important infos
// //Some fields must be updated only by the admin (rfid, billing)
// //Some fields must be updated only by a user that doesn't connect with linkedin (email, fName, lName)
// //Some fields must be updated by the user or the admin (cwpoints, friends, messages, stats, electricityConsumptionLogs)
// //Some fields are not updated, here at least (password, linkedin, role)
// exports.updateUser = asyncHandler(async (req, res, next) => {

// });

// exports.registerRfid = asyncHandler(async (req, res, next) => {

// });

// @desc        Delete account admin feature
// @route       DELETE api/cw-api/users/:userId
// @access      Private
exports.deleteAccountAdmin = asyncHandler(async (req, res, next) => {
    await Profile.findOneAndRemove({ user: req.params.userId });
    await User.findOneAndRemove({ _id: req.params.userId });
    res.status(200).json('User deleted');
});