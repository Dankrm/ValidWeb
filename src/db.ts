import { Sequelize } from 'sequelize';

const sequelize = new Sequelize (
	{
		dialect: "sqlite",
		storage: "./validweb.sqlite"
	}
);
export default sequelize;