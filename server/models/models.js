const sequelize = require("../db");
const {DataTypes} = require("sequelize");

const User = sequelize.define("user", {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    email: {type: DataTypes.STRING, unique: true},
    password: {type: DataTypes.STRING},
    role: {type: DataTypes.STRING, defaultValue: "USER"},
})

const Basket = sequelize.define("basket", {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
})

const BasketThing = sequelize.define("basket_thing", {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
})

const Thing = sequelize.define("thing", {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, unique:true, allowNull: false},
    price: {type: DataTypes.INTEGER, allowNull: false},
    rating: {type: DataTypes.INTEGER, defaultValue: 0},
    img: {type: DataTypes.STRING, allowNull: false},
    size: {type: DataTypes.STRING, allowNull: true},
    description: {type: DataTypes.TEXT, allowNull: true},
})

const Type = sequelize.define("type", {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, unique: true, allowNull: false},
})

const Brand = sequelize.define("brand", {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, unique: true, allowNull: false},
})

const Rating = sequelize.define("rating", {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    rate: {type: DataTypes.INTEGER, allowNull: false},
})

const ThingInfo = sequelize.define("thing_info", {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    title: {type: DataTypes.STRING, allowNull: false},
    description: {type: DataTypes.STRING, allowNull: false},
})

const TypeBrand = sequelize.define("type_brand", {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
})

User.hasOne(Basket)
Basket.belongsTo(User)

User.hasMany(Rating)
Rating.belongsTo(User)

Basket.hasMany(BasketThing)
BasketThing.belongsTo(Basket)

Type.hasMany(Thing)
Thing.belongsTo(Type)

Brand.hasMany(Thing)
Thing.belongsTo(Brand)

Thing.hasMany(Rating)
Rating.belongsTo(Thing)

Thing.hasMany(BasketThing)
BasketThing.belongsTo(Thing)

Thing.hasMany(ThingInfo, {as: 'info'})
ThingInfo.belongsTo(Thing)

Type.belongsTo(Brand, {through: TypeBrand})
Brand.belongsTo(Type, {through: TypeBrand})

module.exports = {
    User,
    Basket,
    BasketThing,
    Thing,
    Type,
    Brand,
    ThingInfo,
    TypeBrand,
    Rating,
}

