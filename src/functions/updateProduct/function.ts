import dbContext from '@dbModel/dbContext';
import Product from '@dbModel/tables/product';
import getProduct from '@functions/getProduct/function';
import createProduct from '@functions/createProduct/function';
import * as AWS from 'aws-sdk';
const updateProduct = async (item: Product): Promise<Product> => {
    const product = await getProduct(item.id, true);
    const sns = new AWS.SNS();

    if (
        item.title != undefined ||
        item.description != undefined ||
        item.categorieId != undefined ||
        item.customSpecs != undefined
    ) {
        product.isSalable = false;
        await dbContext.update(product, { onMissing: 'skip' });

        const newProduct = Object.assign(new Product(), {
            title: item.title ? item.title : product.title,
            description: item.description ? item.description : product.description,
            price: item.price ? item.price : product.price,
            discount: item.discount ? item.discount : product.discount,
            availabilityQta: item.availabilityQta ? item.availabilityQta : product.availabilityQta,
            imageURL: item.imageURL ? item.imageURL : product.imageURL,
            isSalable: item.isSalable ? item.isSalable : product.isSalable,
            categorieId: item.categorieId ? item.categorieId : product.categorieId,
            notes: item.notes ? item.notes : product.notes,
            tags: item.tags ? item.tags : product.tags,
            customSpecs: item.customSpecs ? item.customSpecs : product.customSpecs,
        });
        await sns.publish({
            Message: 'createdNewProduct',
            MessageAttributes: {
                productId: {
                    DataType: 'String',
                    StringValue: item.id,
                }
            },
            TopicArn: 'arn:aws:sns:eu-central-1:780844780884:changeCartOnUpdate'
        }).promise();
        return createProduct(newProduct);

    } else {
        if (item.isSalable === false) {
            await sns.publish({
                Message: 'productNotSalable',
                MessageAttributes: {
                    productId: {
                        DataType: 'String',
                        StringValue: item.id,
                    }
                },
                TopicArn: 'arn:aws:sns:eu-central-1:780844780884:productInCartNotAvailable'
            }).promise();
        } else {
            await sns.publish({
                Message: 'updatedProduct',
                MessageAttributes: {
                    productId: {
                        DataType: 'String',
                        StringValue: item.id,
                    }
                },
                TopicArn: 'arn:aws:sns:eu-central-1:780844780884:changeCartOnUpdate',
            }).promise();
        }
        return dbContext.update(item, { onMissing: 'skip' });
    }
};

export default updateProduct;