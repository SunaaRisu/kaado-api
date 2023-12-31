const express = require('express');
const router = express.Router();

const StackController = require('../controller/stack');

router.get("/get_one", StackController.getOne);

router.get("/get_stack_list", StackController.getStackList);

router.post("/create", StackController.create);

module.exports = router;