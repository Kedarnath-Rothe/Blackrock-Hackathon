const express = require('express');
const controller = require('../controllers/courses_controller');

const router = express.Router(); 

const multer = require("multer");                               //Upload Images
const path = require("path");

const storage = multer.diskStorage({
    destination : function(req , file , cb){
        cb(null, path.join(__dirname, '../../frontend/public/carimages'));
    },
    filename : function(req , file , cb){
        const name = Date.now()+'-'+file.originalname;
        cb(null,name);
    }
})
const upload = multer({storage : storage});

router.route('/addCourse').get(controller.addCourse);

router.route('/addCourse').post(upload.single('image'), controller.addCourse);


router.route('/course').get(controller.course);  


module.exports = router;