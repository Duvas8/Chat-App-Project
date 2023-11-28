const express = require('express');
const usersController = require('../controllers/usersController')

const router = express.Router();

  router.route('/').get(async (req,res)=> {
      try {
        const result = await usersController.getAllUsers();
        res.json(result);
      } catch (error) {
        res.json(error);
      }
    })

  router.route('/').put(async (req, res) => {
    try {
      const { _id } = req.body;
      const obj = req.body;
      const result = await usersController.updateUser(_id, obj);
      res.json(result);
    } catch (error) {
      res.status(500).json('There was an error!');
    }
  });

  router.route('/:id').put(async (req, res) => {
    try {
      const { id } = req.params;
      const obj = req.body;
      const result = await usersController.addContact(id, obj);
      res.json(result);
    } catch (error) {
      res.status(500).json(error);
    }
  });
  router.route('/:id').get(async (req,res)=> {
    try {
      const { id } = req.params;
      const result = await usersController.getAllUsersContacts(id);
      res.json(result);
    } catch (error) {
      res.json(error);
    }
  })
  router.route('/:id').patch(async (req, res) => {
    try {
      const { id } = req.params;
      const obj = req.body;
      console.log(obj);
      const result = await usersController.blockContact(id, obj);
      res.json(result);
    } catch (error) {
      res.status(500).json(error);
    }
  });
  module.exports = router;