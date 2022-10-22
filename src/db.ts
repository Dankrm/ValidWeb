import { Sequelize } from 'sequelize';

const sequelize = new Sequelize (
	"database",
	"",
	"",
	{
		host: "0.0.0.0",
		dialect: "sqlite",
		pool: {
			max: 5,
			min: 0,
			idle: 10000
		},
		storage: "./validweb.sqlite"
	}
);
export default sequelize;