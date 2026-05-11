require('dotenv').config();
const {Sequelize} = require('sequelize');
const url = "postgresql://admin:IjTKV2d1E4prUpEbxY3qTkxCD20e9Arm@dpg-d81214l7vvec73enamjg-a.virginia-postgres.render.com/online_store_mgge";

module.exports = new Sequelize(url, {
    dialect: 'postgres',
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    }
});
