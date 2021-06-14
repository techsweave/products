import 'source-map-support/register';

import Product from '@dbModel/tables/product';
import schema from './schema';
import updateProduct from './function';
import { ValidatedEventAPIGatewayProxyEvent, middyfy, Response, AuthenticatedUser } from 'utilities-techsweave';
import { StatusCodes } from 'http-status-codes';

/*
 * Remember: event.body type is the type of the instantiation of ValidatedEventAPIGatewayProxyEvent
 * In this case event.body type is 'void' -> we have no body!
*/
const updateProductHandler: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
    let response: Response<Product>;
    try {
        const user: AuthenticatedUser = await AuthenticatedUser.fromToken(event.headers?.AccessToken);
        if (!(await user.isVendor(process.env.USER_POOL_ID))) {
            throw {
                name: 'UserNotAllowed',
                message: 'You must be a vendor to update a product'
            };
        }

        const product: Product = new Product();

        product.id = event.pathParameters?.id;
        product.title = event.body.title; //change SKU
        product.description = event.body?.description; //change SKU
        product.price = event.body.price;
        product.discount = event.body?.discount;
        product.availabilityQta = event.body?.availabilityQta;
        product.imageURL = event.body?.imageURL;
        product.isSalable = event.body?.isSalable; // to change to false when create new SKU
        product.categorieId = event.body?.categorieId; //change SKU
        product.notes = event.body?.notes;
        product.tags = event.body?.tags;
        product.customSpecs = event.body?.customSpecs; //change SKU

        response = Response.fromData<Product>(
            await updateProduct(product),
            StatusCodes.OK
        );
    }
    catch (error) {
        response = Response.fromError<Product>(error);
    }
    return response.toAPIGatewayProxyResult();
};

export const main = middyfy(updateProductHandler);
