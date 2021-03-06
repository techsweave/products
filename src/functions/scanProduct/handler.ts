import 'source-map-support/register';

import Product from '@dbModel/tables/product';
import scanProduct from './function';

import { ValidatedEventAPIGatewayProxyEvent, middyfy, Response, AuthenticatedUser } from 'utilities-techsweave';
import StatusCodes from 'http-status-codes';

import schema from './schema';


/*
 * Remember: event.body type is the type of the instantiation of ValidatedEventAPIGatewayProxyEvent
 * In this case event.body type is type of 'Product'
*/
const scanProductHandler: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
    let res: Response<Product> = new Response<Product>();
    let isVendor: boolean;
    try {
        const user: AuthenticatedUser = await AuthenticatedUser.fromToken(event.headers?.accesstoken);
        isVendor = await user.isVendor(process.env.USER_POOL_ID);
    } catch (err) {
        isVendor = false;
    }
    try {
        const result = await scanProduct(event.body, isVendor);
        res = await Response.fromMultipleData(result.items, StatusCodes.OK, result.lastKey);

    } catch (error) {
        res = await Response.fromError<Product>(error);
    }
    return res.toAPIGatewayProxyResult();
};

export const main = middyfy(scanProductHandler);
