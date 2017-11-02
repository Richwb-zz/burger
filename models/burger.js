module.exports = function(sequelize, DataTypes) {
	const Burger = sequelize.define('burger', {
		burger_name: DataTypes.STRING,
		devoured: DataTypes.TINYINT,
		count: DataTypes.INTEGER
	});

	Burger.sync();
	return Burger;
}
