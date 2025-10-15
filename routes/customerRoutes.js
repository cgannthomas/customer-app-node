const express = require('express');
const router = express.Router();
const controller = require('../controllers/customerController');

// Views
router.get('/', controller.indexView);
router.get('/create', (req, res) => 
  res.render('create-or-edit', {
    title: 'Create Customer',
    action: '/api/customers',
    id: '',
    method: 'POST',
    buttonText: 'Save',
    js: ['/js/create.js']
  })
);
router.get('/edit/:id', async (req, res) => {
  res.render('create-or-edit', { 
    id: req.params.id,
    js: ['/js/create.js'],
    title: 'Update Customer',
    action: '/api/customers/' + req.params.id,
    method: 'PUT',
    buttonText: 'Update'
   });
});

// API endpoints 
router.get('/api/customers', controller.listAjax);          // DataTables server-side
router.post('/api/customers', controller.create);          // create
router.get('/api/customers/:id', controller.find);         // get single
router.put('/api/customers/:id', controller.update);       // update
router.delete('/api/customers/:id', controller.delete);    // delete

module.exports = router;
