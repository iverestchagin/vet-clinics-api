const ExportController = require('../controllers/export');
const json2csv = require('json2csv');

function get(req, res, next) {
    ExportController.list()
        .then(data => {
            let csv = json2csv({
                data,
                fields: [
                    {value: 'dataValues.title', label: 'Название'},
                    {value: 'dataValues.navCode', label: 'Код Nav'},
                    {value: 'dataValues.crmCode', label: 'Код CRM'},
                    {value: 'dataValues.apartment', label: 'Дом'},
                    {value: 'dataValues.fias', label: 'Код фиас'},
                    {value: 'dataValues.zipcode', label: 'Почтовый индекс'},
                    {value: 'dataValues.address', label: 'Адрес'},
                    {value: 'dataValues.category', label: 'Категория клиента'},
                    {value: 'dataValues.tradingChannel', label: 'Канал сбыта'},
                    {value: 'dataValues.clientType', label: 'Тип клиента'},
                    {value: 'dataValues.signboard', label: 'Вывеска'},
                    {value: 'dataValues.longitude', label: 'Адрес: широта'},
                    {value: 'dataValues.latitude', label: 'Адрес: долгота'},
                    {value: 'dataValues.square', label: 'Общая площадь ТТ'},
                    {value: 'dataValues.referencePoint', label: 'Ориентир ТТ'},
                    {value: 'dataValues.schedule', label: 'График работы'},
                    {value: 'dataValues.url', label: 'URL'},
                    {value: 'dataValues.phone', label: 'Телефон'},
                    {value: 'dataValues.trustIndex', label: 'Индекс доверия'},
                    {value: 'dataValues.streebeeUpdatedAt', label: 'Дата обновления в StreetBee'},
                    {value: 'dataValues.streetbeeCode', label: 'Код Street Bee'},
                    {value: 'dataValues.isDuplicate', label: 'Дубликат'},
                    {value: 'dataValues.refStreetbeeCode', label: 'Код эталонной записи в StreetBee'},
                    {value: 'dataValues.dealer', label: 'Дилер'},
                    {value: 'dataValues.shippedFrom', label: 'Shipped From'},
                    {value: 'dataValues.wholesaler', label: 'Оптовик'},
                    {value: 'dataValues.serviceTypeInFeedDept', label: 'Тип обслуживания в отделе кормов'},
                    {value: 'dataValues.streetbeeVerificationStatus', label: 'Статус проверки StreetBee'},
                    {value: 'entity.dataValues.title', label: 'Название юридического лица'},
                    {value: 'entity.dataValues.inn',  label: 'ИНН'}
                ],
            });

            res.status(200);
            res.send(csv);
        })
        .catch(next);
}

module.exports = {
    get
};