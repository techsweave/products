import 'source-map-support/register';

import Product from '@dbModel/tables/product';
import getProduct from './function';
import { ValidatedEventAPIGatewayProxyEvent, middyfy, Response, AuthenticatedUser } from 'utilities-techsweave';
import { StatusCodes } from 'http-status-codes';

/*
 * Remember: event.body type is the type of the instantiation of ValidatedEventAPIGatewayProxyEvent
 * In this case event.body type is 'void' -> we have no body!
*/
const getProductHandler: ValidatedEventAPIGatewayProxyEvent<void> = async (event) => {
    let isVendor: boolean;
    try {
        const user: AuthenticatedUser = await AuthenticatedUser.fromToken(event.headers?.AccessToken);
        isVendor = await user.isVendor(process.env.USER_POOL_ID);
    } catch (err) {
        isVendor = false;
    }
    let response: Response<Product>;
    try {
        response = Response.fromData<Product>(
            await getProduct(event.pathParameters?.id, isVendor),
            StatusCodes.OK);
    }
    catch (error) {
        response = Response.fromError<Product>(error);
    }
    return response.toAPIGatewayProxyResult();
};

export const main = middyfy(getProductHandler);
