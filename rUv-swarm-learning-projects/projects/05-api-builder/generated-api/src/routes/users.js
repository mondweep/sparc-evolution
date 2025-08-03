
const express = require('express');
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/auth');
const { validateUser } = require('../middleware/validation');

const router = express.Router();

router.get('/', authMiddleware, userController.getAll);
router.get('/:id', authMiddleware, userController.getById);
router.post('/', validateUser, userController.create);
router.put('/:id', authMiddleware, validateUser, userController.update);
router.delete('/:id', authMiddleware, userController.delete);

module.exports = router;
