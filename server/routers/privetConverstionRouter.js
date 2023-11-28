const express = require('express');
const privetConverstionController = require('../controllers/privetConverstionController')

const router = express.Router();

  router.route('/').get(async (req,res)=> {
    try {
      const result = await privetConverstionController.getAllPrivetConverstion();
      res.json(result);
    } catch (error) {
      res.json(error);
    }
  })


  router.route('/').post(async (req, res) => {
    try {
      const obj = req.body;
      console.log(obj);
      const result = await privetConverstionController.createPrivetConverstion(obj);
      res.json(result);
    } catch (error) {
      res.status(500).json('There was an error!');
    }
  });

  router.route('/:id').patch(async (req, res) => {
    try {
      const { id } = req.params;
      console.log(id);
      const obj = req.body;
      console.log(obj);
      const result = await privetConverstionController.addMessageToPrivetConverstion(id, obj);
      res.json(result);
    } catch (error) {
      res.status(500).json(error);
    }
  });
  module.exports = router;