const User = require('../models/user_model');

const Contact = require('../models/contact_model');

const Course = require('../models/courses_model');


// *-------------------------------------------
// * Get All Users Logic
// *-------------------------------------------
const getAllUsers = async(req, res) => {
    try{
        const users = await User.find( {}, { password : 0 } );

        if(!users || users.length === 0){
            return res.status(404).json({message : "No Users Found"});
        }

        console.log("hiiii");

        return res.status(200).json(users);
    }
    catch(error){
        next(error);
    }

}

// *-------------------------------------------
// * Get All Contacts Logic
// *-------------------------------------------

const getAllContacts = async(req, res) => {
    try{
        const contacts =await Contact.find();

        if(!contacts || contacts.length === 0){
            return res.status(404).json({message : "No Contacts Found"});
        }

        return res.status(200).json(contacts);
    }
    catch(error){
        next(error);
    }
}


// *-------------------------------------------
// * User Delete
// *-------------------------------------------
const deleteUserById = async(req, res) => {
    try{
        const id = req.params.id;
        await User.deleteOne({_id : id});
        return res.status(200).json({message : "User deleted Successfully..."});
    }
    catch(error){
        next(error);
    }
}


// *-------------------------------------------
// * Single User Logic
// *-------------------------------------------
const getUserById = async(req, res) => {
    try{
        const id = req.params.id;
        console.log(id);
        const data = await User.findOne({_id : id}, {password : 0});
        return res.status(200).json(data);
    }
    catch(error){
        console.log(error.message);
    }
}

// *-------------------------------------------
// * Single User Logic
// *-------------------------------------------
const updateUserById = async(req, res) => {
    try{
        const id = req.params.id;
        const updateUserData = req.body;

        const updateData = await User.updateOne(
            {_id : id},
            {$set : updateUserData}
        );

        return res.status(200).json(updateData);
    }
    catch(error){
        next(error);
    }
}

// *-------------------------------------------
// * Contact Delete
// *-------------------------------------------
const deleteContactById = async(req, res) => {
    try{
        const id = req.params.id;
        await Contact.deleteOne({_id : id});
        return res.status(200).json({message : "Contact deleted Successfully..."});
    }
    catch(error){
        next(error);
    }
}


// *-------------------------------------------
// * Get All Courses Logic
// *-------------------------------------------
const getAllCourses = async(req, res) => {
    try{
        const course = await Course.find( {}, { password : 0 } );

        if(!course || course.length === 0){
            return res.status(404).json({message : "No Courses Found"});
        }

        return res.status(200).json(course);
    }
    catch(error){
        next(error);
    }

}


// *-------------------------------------------
// * Course Delete
// *-------------------------------------------
const deleteCourseById = async(req, res) => {
    try{
        const id = req.params.id;
        await Course.deleteOne({_id : id});
        return res.status(200).json({message : "Course deleted Successfully..."});
    }
    catch(error){
        next(error);
    }
}


// *-------------------------------------------
// * Single Course Logic
// *-------------------------------------------
const getCourseById = async(req, res) => {
    try{
        const id = req.params.id;
        console.log(id);
        const data = await Course.findOne({_id : id}, {password : 0});
        return res.status(200).json(data);
    }
    catch(error){
        console.log(error.message);
    }
}

// *-------------------------------------------
// * Single Course Logic
// *-------------------------------------------
const updateCourseById = async(req, res) => {
    try{
        const id = req.params.id;
        const updateUserData = req.body;

        const updateData = await Course.updateOne(
            {_id : id},
            {$set : updateUserData}
        );

        return res.status(200).json(updateData);
    }
    catch(error){
        next(error);
    }
}


module.exports = {getAllUsers, getAllContacts, deleteUserById, getUserById, updateUserById, deleteContactById, getAllCourses, deleteCourseById, getCourseById, updateCourseById};