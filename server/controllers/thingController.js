const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');
const { Op } = require('sequelize');
const { Thing, ThingInfo, Brand, Type } = require("../models/models");
const ApiError = require("../errorHandler/apiError");

class ThingController {
    async create(req, res, next) {
        try {
            let { name, price, brandId, typeId, info, size, description } = req.body;

            if (!req.files || !req.files.img) {
                return next(ApiError.badRequest("Необходимо загрузить изображение"));
            }

            const { img } = req.files;
            let fileName = uuidv4() + ".jpg";
            img.mv(path.resolve(__dirname, '..', 'static', fileName));

            const thing = await Thing.create({ name, price, brandId, typeId, img: fileName, size, description });

            if (info) {
                let parsedInfo = typeof info === 'string' ? JSON.parse(info) : info;
                if (Array.isArray(parsedInfo)) {
                    await Promise.all(parsedInfo.map(item =>
                        ThingInfo.create({
                            title: item.title,
                            description: item.description,
                            thingId: thing.id
                        })
                    ));
                }
            }

            const fullThing = await Thing.findOne({
                where: { id: thing.id },
                include: [
                    { model: Brand, attributes: ['id', 'name'] },
                    { model: Type, attributes: ['id', 'name'] }
                ]
            });
            return res.json(fullThing);
        } catch (err) {
            next(ApiError.badRequest(err.message));
        }
    }

    async getAll(req, res, next) {
        try {
            let { brandId, typeId, page, limit, search, minPrice, maxPrice } = req.query;
            page = page || 1;
            limit = limit || 9;
            let offset = (page - 1) * limit;

            let where = {};
            if (brandId) where.brandId = brandId;
            if (typeId) where.typeId = typeId;

            if (search) where.name = { [Op.iLike]: `%${search}%` };

            // ФИЛЬТР ПО ЦЕНЕ
            if (minPrice || maxPrice) {
                where.price = {};
                if (minPrice) where.price[Op.gte] = Number(minPrice);
                if (maxPrice) where.price[Op.lte] = Number(maxPrice);
            }

            let things = await Thing.findAndCountAll({
                where,
                limit: parseInt(limit),
                offset: parseInt(offset),
                include: [
                    { model: Brand, attributes: ['id', 'name'] },
                    { model: Type, attributes: ['id', 'name'] }
                ],
                order: [['id', 'DESC']],
                distinct: true
            });

            return res.json(things);
        } catch (err) {
            next(ApiError.badRequest(err.message));
        }
    }

    async delete(req, res, next) {
        try {
            const { id } = req.params;
            const thing = await Thing.findOne({ where: { id } });
            if (!thing) {
                return next(ApiError.badRequest("Товар не найден"));
            }

            const imgPath = path.resolve(__dirname, '..', 'static', thing.img);
            if (fs.existsSync(imgPath)) {
                fs.unlinkSync(imgPath);
            }

            await ThingInfo.destroy({ where: { thingId: id } });
            await thing.destroy();

            return res.json({ message: "Товар удалён", id });
        } catch (err) {
            next(ApiError.badRequest(err.message));
        }
    }

    async getOne(req, res, next) {
        try {
            const { id } = req.params;
            const thing = await Thing.findOne({
                where: { id },
                include: [
                    { model: ThingInfo, as: 'info' },
                    { model: Brand, attributes: ['id', 'name'] },
                    { model: Type, attributes: ['id', 'name'] }
                ]
            });
            if (!thing) return next(ApiError.badRequest("Товар не найден"));
            return res.json(thing);
        } catch (err) {
            next(ApiError.badRequest(err.message));
        }
    }
}

module.exports = new ThingController();