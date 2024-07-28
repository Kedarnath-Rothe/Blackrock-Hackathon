const express = require('express');
const controller = require('../controllers/admin_controller');
const authMiddleware = require('../middlewares/auth-middleware');

const router = express.Router();



router.route('/users').get(authMiddleware, controller.getAllUsers);

router.route('/users/:id').get(authMiddleware, controller.getUserById);

router.route('/users/update/:id').patch(authMiddleware, controller.updateUserById);

router.route('/users/delete/:id').delete(authMiddleware, controller.deleteUserById);

router.route('/contacts').get(authMiddleware, controller.getAllContacts);

router.route('/contacts/delete/:id').delete(authMiddleware, controller.deleteContactById);



router.route('/courses').get(authMiddleware, controller.getAllCourses);

router.route('/courses/:id').get(authMiddleware, controller.getCourseById);

router.route('/courses/update/:id').patch(authMiddleware, controller.updateCourseById);

router.route('/courses/delete/:id').delete(authMiddleware, controller.deleteCourseById);

module.exports = router;