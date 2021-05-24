import 'source-map-support/register';

import Product from '@dbModel/tables/product';
import deleteProduct from './function';
import { ValidatedEventAPIGatewayProxyEvent, middyfy, Response } from 'utilities-techsweave';

import { StatusCodes } from 'http-status-codes';
/*
 * Remember: event.body type is the type of the instantiation of ValidatedEventAPIGatewayProxyEvent
 * In this case event.body type is type of 'Product'
*/
const deleteProductHandler: ValidatedEventAPIGatewayProxyEvent<void> = async (event) => {
    let res: Response<Product>;
    try {
        res = Response.fromData<Product>(
            await deleteProduct(event.pathParameters.id),
            StatusCodes.OK);

    } catch (error) {
        res = Response.fromError<Product>(error);
    }
    return res.toAPIGatewayProxyResult();
};

export const main = middyfy(deleteProductHandler);
