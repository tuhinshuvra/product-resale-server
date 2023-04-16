const express = require("express");
const categoriesController = require("../../controllers/categories.controllers");
const router = express.Router();


// router.get('/', (req, res) => {
//     res.send('categories Found');
// })

// router.post('/', (req, res) => {
//     res.send('categories added');
// })

// router.get('/:id', (req, res) => {
//     res.send('A category by id');
// })

router.route('/')
    .get(categoriesController.getAllCategories)
    .post(categoriesController.saveACategory)
    .put(categoriesController.updateACategory)
    .delete(categoriesController.deleteACategory)

router.route("/:id").get(categoriesController.getCategoriesDetails)

// router.delete('/:id', (req, res) => {
//     res.send('The Category with id item deleted successfully');
// })



module.exports = router;