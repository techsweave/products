import dbContext from '@dbModel/dbContext';
import Product from '@dbModel/tables/product';
import * as AWS from 'aws-sdk';
import getProduct from '@functions/getProduct/function';
import { Image } from 'utilities-techsweave';
const deleteProduct = async (id: string): Promise<Product> => {
    const item: Product = await getProduct(id);

    //delete linked image if exists
    if (item.imageURL) {
        const s3 = new AWS.S3();
        const image: Image = await Image.createImageFromS3Url(item.imageURL);
        await s3.deleteObject({ Bucket: process.env.BUCKET_NAME, Key: await image.getKey() });//
    }

    return dbContext.delete(item);
};

export default deleteProduct;