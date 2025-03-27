const express = require('express');
const router = express.Router();
const plantController = require('../controllers/plantController');

router.get('/', plantController.getPlants);
router.post('/', plantController.addPlant);
router.delete('/:id', plantController.deletePlant);
router.put('/:id', plantController.updatePlant);

module.exports = router;