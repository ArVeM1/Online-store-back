import {v4 as uuidv4} from 'uuid';
import * as path from "path";
import {Device, DeviceInfo} from "../models/models.js";
import {ApiError} from "../error/ApiError.js";
import {fileURLToPath} from 'url';
import {where} from "sequelize";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class DeviceController {
    async create(req, res, next) {
        try {
            let {name, price, brandId, typeId, info} = req.body
            const {img} = req.files
            let fileName = uuidv4() + ".jpg"
            await img.mv(path.resolve(__dirname, "..", 'static', fileName))

            if (info) {
                info = JSON.parse(info)
                info.forEach(i => {
                    DeviceInfo.create({
                        title: i.title,
                        description: i.description,
                        deviceId: i.deviceId,
                    })
                })
            }

            const device = await Device.create({name, price, brandId, typeId, info, img: fileName})
            return res.json(device)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async getAll(req, res) {
        let {brandId, typeId, limit, page} = req.query
        page = page || 1
        limit = limit || 9
        let offset = page * limit - limit
        let devices;
        if (brandId && typeId) {
            devices = await Device.findAndCountAll({where: {typeId, brandId}, limit, offset})
        }
        if (brandId && !typeId) {
            devices = await Device.findAndCountAll({where: {brandId}, limit, offset})
        }
        if (!brandId && typeId) {
            devices = await Device.findAndCountAll({where: {typeId}, limit, offset})
        }
        if (!brandId && !typeId) {
            devices = await Device.findAndCountAll({limit, offset})
        }
        return res.json(devices)
    }

    async getOne(req, res) {
        const {id} = req.params
        const findOneDevice = await Device.findOne({
            where: {id},
            include: [{
                model: DeviceInfo,
                as: 'info'
            }]
        })
        return res.json(findOneDevice);
    }
}

export default new DeviceController();