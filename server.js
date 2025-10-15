require('dotenv').config();
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const expressLayouts = require('express-ejs-layouts');
const morgan = require('morgan');
const methodOverride = require('method-override');
const cors = require('cors');

const customerRoutes = require('./routes/customerRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Mongo connect (no deprecated options)
mongoose.connect(process.env.MONGO_URI)
  .then(()=> console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connect error:', err));

// Middlewares
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

// Views & layouts
app.use(expressLayouts);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('layout', 'layouts/layout'); // default layout

// Routes
app.use('/', customerRoutes);

// Start server
app.listen(PORT, () => console.log(`Server running http://localhost:${PORT}`));
