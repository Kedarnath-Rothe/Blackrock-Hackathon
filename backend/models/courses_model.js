const {Schema, model, Mongoose} = require('mongoose');

const courseSchema = new Schema({
    courseName : {
        type : String,
        required : true
    },
    category : {
        type : String,
        required : true
    },
    price : {
        type : Number,
        required : true
    }, 
    image : {
        type : String,
        required : true
    },
    details : {
        type : String,
        required : true
    },

    tags : {
        type : String,
        required : true
    },


    // 
    cust_id : {
        type : String, 
        default : ""
    },  
    transaction_id : {
        type : String, 
        default : ""
    }

})
 
const Course = new model("Course", courseSchema);

module.exports = Course;