const { Router } = require('express');
const ctrl = require('../controllers/tasks.controller');

const router = Router();

router.get('/stats',  ctrl.getStats);   // must come before /:id
router.get('/',       ctrl.listTasks);
router.get('/:id',    ctrl.getTask);
router.post('/',      ctrl.createTask);
router.put('/:id',    ctrl.updateTask);
router.delete('/:id', ctrl.deleteTask);

module.exports = router;
