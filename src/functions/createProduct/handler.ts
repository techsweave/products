import 'source-map-support/register';

import Product from '@dbModel/tables/product';
import schema from './schema';
import createProduct from './function';
import { ValidatedEventAPIGatewayProxyEvent, middyfy, Response, AuthenticatedUser } from 'utilities-techsweave';
import { StatusCodes } from 'http-status-codes';

/*
 * Remember: event.body type is the type of the instantiation of ValidatedEventAPIGatewayProxyEvent
 * In this case event.body type is type of 'Product'
*/
const createProductHandler: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
    let res: Response<Product>;

    try {

        const user: AuthenticatedUser = await AuthenticatedUser.fromToken(event.headers?.accesstoken);
        if (!(await user.isVendor(process.env.USER_POOL_ID))) {
            throw {
                name: 'UserNotAllowed',
                message: 'You must be a vendor to create a product'
            };
        }

        const product: Product = new Product();

        product.title = event.body.title;
        product.description = event.body?.description;
        product.price = event.body.price;
        product.discount = event.body?.discount;
        product.availabilityQta = event.body?.availabilityQta;
        product.imageURL = event.body?.imagePath;
        product.isSalable = event.body?.isSalable;
        product.categorieId = event.body?.categorieId;
        product.notes = event.body?.notes;
        product.tags = event.body?.tags;
        product.customSpecs = event.body?.customSpecs;

        res = await Response.fromData<Product>(await createProduct(product), StatusCodes.CREATED);

    } catch (error) {
        res = await Response.fromError<Product>(error);
    }
    return res.toAPIGatewayProxyResult();
};

export const main = middyfy(createProductHandler);
