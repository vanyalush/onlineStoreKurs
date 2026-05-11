const Router = require('express');
const router = new Router();
const thingController = require('../controllers/thingController');
const checkRole = require('../middleware/checkRoleMiddleware');

router.post('/', checkRole('ADMIN'), thingController.create);
router.delete('/:id', checkRole('ADMIN'), thingController.delete);
router.get('/', thingController.getAll);
router.get('/:id', thingController.getOne);

module.exports = router;
