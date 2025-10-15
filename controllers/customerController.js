const Customer = require('../models/Customer');
const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
// ensure data folder exists (optional if you want txt file backups)
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR);

module.exports = {
  // Render index page (the EJS will load DataTables and fetch via AJAX)
  indexView: (req, res) => {
    res.render('index', {js: ['/js/main.js'],});
  },

  // DataTables server-side endpoint
  listAjax: async (req, res) => {
    try {
      const draw = Number(req.query.draw) || 0;
      const start = Number(req.query.start) || 0;
      const length = Number(req.query.length) || 10;
      const searchValue = req.query.customerid?.trim() || '';

      const query = searchValue
        ? { customerid: { $regex: searchValue, $options: 'i' } }
        : {};
      const total = await Customer.countDocuments({});
      const filtered = await Customer.countDocuments(query);

      const data = await Customer.find(query)
        .sort({ createdAt: -1 })
        .skip(start)
        .limit(length)
        .lean();

      // format rows for DataTables (add action HTML)
      const rows = data.map(doc => ([
        doc.customerid,
        doc.firstname,
        doc.lastname,
        doc.address,
        doc.city,
        doc.province,
        doc.postalcode,
        `<a class="btn-edit" data-id="${doc._id}" href="/edit/${doc._id}"><svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
          <path fill-rule="evenodd" d="M11.32 6.176H5c-1.105 0-2 .949-2 2.118v10.588C3 20.052 3.895 21 5 21h11c1.105 0 2-.948 2-2.118v-7.75l-3.914 4.144A2.46 2.46 0 0 1 12.81 16l-2.681.568c-1.75.37-3.292-1.263-2.942-3.115l.536-2.839c.097-.512.335-.983.684-1.352l2.914-3.086Z" clip-rule="evenodd"/>
          <path fill-rule="evenodd" d="M19.846 4.318a2.148 2.148 0 0 0-.437-.692 2.014 2.014 0 0 0-.654-.463 1.92 1.92 0 0 0-1.544 0 2.014 2.014 0 0 0-.654.463l-.546.578 2.852 3.02.546-.579a2.14 2.14 0 0 0 .437-.692 2.244 2.244 0 0 0 0-1.635ZM17.45 8.721 14.597 5.7 9.82 10.76a.54.54 0 0 0-.137.27l-.536 2.84c-.07.37.239.696.588.622l2.682-.567a.492.492 0 0 0 .255-.145l4.778-5.06Z" clip-rule="evenodd"/>
        </svg></a>
         <a href="javascript:void(0)" class="btn-delete" data-id="${doc._id}" data-customerid="${doc.customerid}"><svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z"/>
        </svg></a>`
      ]));

      res.json({
        draw, recordsTotal: total, recordsFiltered: filtered, data: rows
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  },

  // Create (AJAX)
  create: async (req, res) => {
    try {
      const payload = req.body;
      if (!payload.customerid) return res.status(400).send('customerid required');

      // unique check
      const exists = await Customer.findOne({ customerid: payload.customerid });
      if (exists) return res.status(409).send('Customer ID already exists');

      const created = await Customer.create(payload);

      // optional: write json file backup as customerid.txt
      const filename = path.join(DATA_DIR, `${payload.customerid}.txt`);
      fs.writeFileSync(filename, JSON.stringify(payload));

      res.status(201).json('Customer created successfully!!');
    } catch (err) {
      console.error(err);
      res.status(500).send(err.message || 'Error creating customer');
    }
  },

  // Read single (AJAX)
  find: async (req, res) => {
    try {
      const id = req.params.id;
      const customer = await Customer.findById(id).lean();
      if (!customer) return res.status(404).send('Not found');
      res.json(customer);
    } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
    }
  },

  // Update (AJAX)
  update: async (req, res) => {
    try {
      const id = req.params.id;
      const payload = req.body;

      const customer = await Customer.findById(id);
      if (!customer) return res.status(404).send('Customer not found');

      // If customerid field is in payload and changed, ensure uniqueness
      if (payload.customerid && payload.customerid !== customer.customerid) {
        const exists = await Customer.findOne({ customerid: payload.customerid });
        if (exists) return res.status(409).send('customerid already in use');
      }

      Object.assign(customer, payload);
      await customer.save();

      // optional: overwrite txt backup
      const filename = path.join(DATA_DIR, `${customer.customerid}.txt`);
      fs.writeFileSync(filename, JSON.stringify({
        customerid: customer.customerid,
        firstname: customer.firstname,
        lastname: customer.lastname,
        address: customer.address,
        city: customer.city,
        province: customer.province,
        postalcode: customer.postalcode
      }));

      res.json('Customer details updated successfully!!');
    } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
    }
  },

  // Delete (AJAX)
  delete: async (req, res) => {
    try {
      const id = req.params.id;
      const customer = await Customer.findByIdAndDelete(id);
      if (!customer) return res.status(404).send('Customer not found');

      // optional: remove .txt file
      const filename = path.join(DATA_DIR, `${customer.customerid}.txt`);
      if (fs.existsSync(filename)) fs.unlinkSync(filename);

      res.json({ message: 'deleted' });
    } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
    }
  }
};
