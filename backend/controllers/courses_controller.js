
const Course = require('../models/courses_model');


// ??AddCourse Post
const addCourse = async (req, res) => {
    try {
        // Destructure Course details from request body
        const { courseName, price, details, category, tags } = req.body;

        const imageUrl = req.headers['x-additional-info'];
        console.log(imageUrl);

        // const tag = JSON.parse(_tags);

        console.log(tags)

        // Create new car instance
        const courseCreated = await Course.create({ courseName, price, details, image:imageUrl, category, tags });

        // Return success response with car details
        res.status(200).json({
            message: "Course added successful",
            course: courseCreated
        });

    } catch (error) {
        console.log(error);
        res.status(500).json('Internal server error');
    }
}


const course = async(req, res) => {
    try{ 
        const response = await Course.find(); 
        if(!response) {
            res.status(404).json({message : "No Course Found"})
            return;
        }  
        // console.log(response);
        // console.log(response);
        return res.status(200).json({msg : "Course found", data : response})
    }
    catch(error){
        console.log(error.message); 
    }
}

module.exports = {
    course,
    addCourse
};