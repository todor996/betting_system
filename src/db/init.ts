import { Dialect } from 'sequelize';
import dotenv from 'dotenv';
import { Sequelize } from 'sequelize-typescript';
import config from './config/config.json';
import Models from './models';
dotenv.config();
const sequelize: Sequelize = new Sequelize({
  storage: config[process.env.NODE_ENV as 'development' | 'test'].storage,
  dialect: config[process.env.NODE_ENV as 'development' | 'test']
    .dialect as Dialect,
  models: Models
});

export default sequelize;
