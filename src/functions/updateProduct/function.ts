import dbContext from '@dbModel/dbContext';
import Product from '@dbModel/tables/product';
import getProduct from '@functions/getProduct/function';
import * as AWS from 'aws-sdk';
const updateProduct = async (item: Product): Promise<Product> => {
    const product = await getProduct(item.id, true);
    const sns = new AWS.SNS();
    let ret;
    if (
        item.title != product.title ||
        item.price != product.price ||
        item.customSpecs.map((item, i) => {
            item.value != product.customSpecs[i].value;
        })
    ) {
        product.isSalable = false;
        await dbContext.update(product);
        ret = await dbContext.put(item);
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
        return ret;
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