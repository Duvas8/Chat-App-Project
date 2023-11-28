const express = require('express');
const groupsController = require('../controllers/groupsController')

const router = express.Router();

  router.route('/').get(async (req,res)=> {
    try {
      const result = await groupsController.getAllGroups();
      res.json(result);
    } catch (error) {
      res.json(error);
    }
  })


  router.route('/').post(async (req, res) => {
    try {
      const obj = req.body;
      console.log(obj);
      const result = await groupsController.createGroup(obj);
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
      const result = await groupsController.addMessageToGroup(id, obj);
      res.json(result);
    } catch (error) {
      res.status(500).json(error);
      }
  });

  router.route('/:id/addContact').patch(async (req, res) => {
    try {
      const { id } = req.params;
      console.log(id);
      const obj = req.body;
      console.log(obj);
      const result = await groupsController.addContactToGroup(id, obj);
      res.json(result);
    } catch (error) {
      res.status(500).json(error);
      }
  });

  router.route('/:id/leave-Group').patch(async (req, res) => {
    try {
      const { id } = req.params;
      console.log("test",id);
      const obj = req.body;
      console.log("test",obj);
      const result = await groupsController.removeUserFromGroup(id, obj);
      res.json(result);
    } catch (error) {
      res.status(500).json(error);
      }
  });
  module.exports = router;