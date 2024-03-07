const Profile = require('../models/Profile');
const User = require('../models/User');
const { uploadImageToCloudinary } = require("../utils/imageUploader");

exports.updateProfile = async(req, res) => {
    try {
        const {dateOfBirth="", about="", contactNumber="", gender} = req.body;
        
        const id = req.user.id;

        if(!contactNumber || !id) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            })
        }

        const userDetails = await User.findById(id);
        const profileId = userDetails.additionalDetails;
        const profileDetails = await Profile.findById(profileId);

        profileDetails.dateOfBirth = dateOfBirth;
        profileDetails.about = about;
        profileDetails.gender = gender;
        profileDetails.contactNumber = contactNumber;

        await profileDetails.save();

        return res.status(200).json({
            success: true,
            message: 'Profile Updated Successfully',
            profileDetails
        })
    }
    catch(error) {
        return res.status(500).json({
            success: false,
            error: error.message
        })
    }
}

exports.deleteAccount = async(req, res) => {
    try {
        const id = req.user.id;

        const userDetails = await User.findById(id);
        if(!userDetails) {
            return res.status(404).json({
                success: false,
                message: "User not Found"
            });
        }

        await Profile.findByIdAndDelete({_id: userDetails.additionalDetails});
        // delete from enrolled Acoount for student
        await User.findByIdAndDelete({_id: id});

        return res.status(200).json({
            success: true,
            message: "User Deleted Successfully"
        })
    }
    catch(error) {
        return res.status(500).json({
            success: false,
            message: "User cannot be deleted Successfully",
            error: error.message
        })
    }
}

exports.getAllUserDetails = async(req, res) => {
    try {
        const id = req.user.id;
        const userDetails = await User.findById(id).populate("additionalDetails").exec();

        return res.status(200).json({
            success: true,
            message: "User Data fetched Successfully",
            userDetails
        })
    }   
    catch(error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

exports.updateDisplayPicture = async (req, res) => {
    try {
      const displayPicture = req.files.displayPicture
      const userId = req.user.id
      const image = await uploadImageToCloudinary(
        displayPicture,
        process.env.FOLDER_NAME,
        1000,
        1000
      )
      console.log(image)
      const updatedProfile = await User.findByIdAndUpdate(
        { _id: userId },
        { image: image.secure_url },
        { new: true }
      )
      res.send({
        success: true,
        message: `Image Updated successfully`,
        data: updatedProfile,
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      })
    }
};
  
exports.getEnrolledCourses = async (req, res) => {
    try {
      const userId = req.user.id
      const userDetails = await User.findOne({
        _id: userId,
      })
        .populate("courses")
        .exec()
      if (!userDetails) {
        return res.status(400).json({
          success: false,
          message: `Could not find user with id: ${userDetails}`,
        })
      }
      return res.status(200).json({
        success: true,
        data: userDetails.courses,
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      })
    }
};