const log = console.log;

const Product = require('../models/product.model');

module.exports.products = (request, response, next) => {
    return response.status(200).json({
        products: Product.fetchAll()
    });
};

module.exports.add_product = (request, response, next) => {
    log(request.body);

    if(!request.body.id){
        return response.status(422).json({
            code: 422,
            msg: 'Id is missing'
        });
    }

    if(!request.body.name){
        return response.status(422).json({
            code: 422,
            msg: 'Name is missing'
        });
    }

    if(!request.body.price){
        return response.status(422).json({
            code: 422,
            msg: 'Price is missing'
        });
    }

    const product = {
        id: request.body.id,
        name: request.body.name,
        price: request.body.price
    };

    Product.save(product);

    return response.status(201).json({
        code: 201,
        msg: 'Product created successfully!',
        product: product
    });
};

module.exports.prepare_million_products = (request, response, next) => {
    Product.prepareMillionProducts();

    return response.status(200).json({
        code: 200,
        msg: 'Products prepared successfully'
    });
};