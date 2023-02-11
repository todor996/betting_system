import { Dialect } from "sequelize";
import { Sequelize } from 'sequelize-typescript';
import config from './config/config.json';
import Models from "./models";

const sequelize: Sequelize = new Sequelize({
    storage: config.development.storage,
    dialect: config.development.dialect as Dialect,
    models: Models
});

export default sequelize;
