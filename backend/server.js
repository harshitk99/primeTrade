const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
const cors = require('cors');
const helmet = require('helmet');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const logger = require('./utils/logger');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Body parser
app.use(express.json());

// Enable CORS
app.use(cors());

// Set security headers
app.use(helmet());

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Load Swagger document
const swaggerDocument = YAML.load('./swagger.yaml');

// Mount routers
app.use('/api/v1/auth', require('./routes/authRoutes'));
app.use('/api/v1/products', require('./routes/productRoutes'));

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/', (req, res) => {
    res.send('API is running...');
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(
    PORT,
    () => {
        logger.info(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
        console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    }
);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`);
    // Close server & exit process
    server.close(() => process.exit(1));
});
