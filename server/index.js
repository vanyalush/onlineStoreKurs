require('dotenv').config();
const express = require('express');
const sequelize = require('./db');
const models = require('./models/models');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const router = require('./routes/index');
const errorHandler = require('./middleware/errorHandlingMiddleware');
const path = require('path');

const PORT = process.env.PORT || 5000;

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.resolve(__dirname, 'static')));
app.use(fileUpload({}));
app.use('/api', router);


app.use(errorHandler);

const start = async () => {
    try{
        console.log('Попытка подключения к базе данных...');
        await sequelize.authenticate();
        console.log('Подключение к БД успешно!');
        await sequelize.sync();
        console.log('Синхронизация моделей завершена!');
        app.listen(PORT, () => console.log(`Server started on port: ${PORT}`));
    } catch(e) {
        console.error('Ошибка при запуске сервера:', e);
    }
}

start();