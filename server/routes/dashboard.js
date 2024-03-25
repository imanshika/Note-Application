const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { isLoggedIn } = require('../middleware/checkAuth');


//Dashboard Routes
router.get('/dashboard', isLoggedIn, dashboardController.homepage);
router.get('/dashboard/item/:id', isLoggedIn, dashboardController.viewNote);
router.put('/dashboard/item/:id', isLoggedIn, dashboardController.updateNote);
router.delete('/dashboard/item-delete/:id', isLoggedIn, dashboardController.deleteNote);
router.delete('/dashboard/item-delete/:id', isLoggedIn, dashboardController.deleteNote);
router.get('/dashboard/add', isLoggedIn, dashboardController.addNoteGet);
router.post('/dashboard/add', isLoggedIn, dashboardController.addNotePost);
router.get('/dashboard/search', isLoggedIn, dashboardController.searchGet);
router.post('/dashboard/search', isLoggedIn, dashboardController.searchPost);
router.delete('/deleteAccount', isLoggedIn, dashboardController.deleteAccount);


module.exports = router;
