const Course = require('../models/Course')
const Category = require('../models/Category')
const User = require('../models/User')
const {uploadImageToCloudinary} = require('../utils/imageUploader');

exports.createCourse = async(req, res) => {
    try {
        let {
			courseName,
			courseDescription,
			whatYouWillLearn,
			price,
			tag,
			category,
			status,
			instructions,
		} = req.body;

        const thumbnail = req.files.thumbnailImage;

        if(!courseName ||
			!courseDescription ||
			!whatYouWillLearn ||
			!price ||
			!tag ||
			!thumbnail ||
			!category) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }

        if (!status || status === undefined) {
			status = "Draft";
		}
        
        const userId = req.user.id;
        const instructorDetails = await User.findById(userId, {accountType: "Instructor"});
        console.log("Instructor Details: ", instructorDetails);

        if(!instructorDetails) {
            return res.status(404).json({
                success: false,
                message: 'Instructor Details not found'
            })
        }

        const CategoryDetails = await Category.findById(category);
        if(!CategoryDetails) {
            return res.status(404).json({
                success: false,
                message: 'Category Details not found'
            })
        }

        const thumbnailImage = await uploadImageToCloudinary(thumbnail, process.env.FOLDER_NAME);
    
        const newCourse = await Course.create({
            courseName,
			courseDescription,
			instructor: instructorDetails._id,
			whatYouWillLearn: whatYouWillLearn,
			price,
			tag: tag,
			category: CategoryDetails._id,
			thumbnail: thumbnailImage.secure_url,
			status: status,
			instructions: instructions,
        })

        await User.findByIdAndUpdate(
            {_id: instructorDetails._id},
            {
                $push: {
                    courses: newCourse._id
                }
            },
            {new: true}
        )

        // update Category Schema(HW)

        res.status(200).json({
            success: true,
            message: "Course Created Successfully",
            data: newCourse
        })
    }
    catch(error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to create course",
            error: error.message
        })
    }
}

exports.getAllCourses = async (req, res) => {
    try {
        const allCourses = await Course.find({}, {courseName: true, price: true, thumbnail: true, instructor: true,
        ratingAndReviews: true, studentEnrolled: true })
        .populate("instructor")
        .exec();

        return res.status(200).json({
            success: true,
            message: "Data for all courses fetched Successfully",
            data: allCourses
        })
    }
    catch(error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Cannot fetch Course Data",
            error: error.message
        })
    }
}

exports.getCourseDetails = async(req, res) => {
    try {
        const {courseId} = req.body;
        const courseDetails = await Course.find(
            {_id: courseId}
        )
        .populate({
            path: "instructor",
            populate: {
                path: "additionalDetails"
            },
        })
        .populate("category")
        .populate("ratingAndReviews")
        .populate({
            path: "courseContent",
            populate: {
                path: "subSection"
            }
        })
        .exec();

        if(!courseDetails) {
            return res.status(400).json({
                success: false,
                message: `could not find the course with ${courseId}`
            });
        }

        return res.status(200).json({
            success: true,
            message: "course details fetched Successfully",
            dara: courseDetails
        })
    }
    catch(error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}