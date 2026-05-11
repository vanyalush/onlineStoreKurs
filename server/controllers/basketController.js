const { Basket, BasketThing, Thing, Brand, Type } = require("../models/models");
const ApiError = require("../errorHandler/apiError");

class BasketController {
    async getBasket(req, res, next) {
        try {
            const userId = req.user.id;
            let basket = await Basket.findOne({ where: { userId } });
            if (!basket) {
                basket = await Basket.create({ userId });
            }
            const items = await BasketThing.findAll({
                where: { basketId: basket.id },
                include: [{
                    model: Thing,
                    include: [
                        { model: Brand, attributes: ['id', 'name'] },
                        { model: Type, attributes: ['id', 'name'] }
                    ]
                }]
            });
            return res.json(items);
        } catch (err) {
            next(ApiError.badRequest(err.message));
        }
    }

    async addToBasket(req, res, next) {
        try {
            const userId = req.user.id;
            const { thingId } = req.body;

            let basket = await Basket.findOne({ where: { userId } });
            if (!basket) {
                basket = await Basket.create({ userId });
            }

            const existing = await BasketThing.findOne({
                where: { basketId: basket.id, thingId }
            });
            if (existing) {
                return res.json(existing);
            }

            const item = await BasketThing.create({ basketId: basket.id, thingId });
            return res.json(item);
        } catch (err) {
            next(ApiError.badRequest(err.message));
        }
    }

    async removeFromBasket(req, res, next) {
        try {
            const userId = req.user.id;
            const { thingId } = req.params;

            const basket = await Basket.findOne({ where: { userId } });
            if (!basket) return res.json({ message: "Корзина не найдена" });

            await BasketThing.destroy({ where: { basketId: basket.id, thingId } });
            return res.json({ message: "Удалено из корзины" });
        } catch (err) {
            next(ApiError.badRequest(err.message));
        }
    }

    async clearBasket(req, res, next) {
        try {
            const userId = req.user.id;
            const basket = await Basket.findOne({ where: { userId } });
            if (basket) {
                await BasketThing.destroy({ where: { basketId: basket.id } });
            }
            return res.json({ message: "Корзина очищена" });
        } catch (err) {
            next(ApiError.badRequest(err.message));
        }
    }
}

module.exports = new BasketController();