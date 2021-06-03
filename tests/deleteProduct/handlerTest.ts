import { main as deleteProductHandler } from '../../src/functions/deleteProduct/handler';
import { expect } from 'chai';
import { fakeContext, IFakeEvent, TestUser } from 'utilities-techsweave';
import Product from '../../src/models/database/tables/product';
import * as AWS from 'aws-sdk';
import { APIGatewayProxyResult } from 'aws-lambda';
import createProduct from '../../src/functions/createProduct/function';
import { StatusCodes } from 'http-status-codes';

describe('handler: deleteProduct', async () => {
    const expectedProduct: Product = new Product();
    expectedProduct.id = '484cdb36-c10f-4734-ad44-86b0356893b0';
    expectedProduct.title = 'black t-shirt';
    expectedProduct.description = 'A beautiful black t-shirt';
    expectedProduct.price = 20;
    expectedProduct.availabilityQta = 20;
    expectedProduct.SKU = 'SKU12345';

    it('Vendor working delete', async () => {
        AWS.config.update({ region: process.env.REGION });
        const test = await TestUser.fromRole(true, process.env.USER_POOL_ID);
        const e: IFakeEvent = {
            headers: {
                AccessToken: await test.getAccessToken()
            },
            pathParameters: '484cdb36-c10f-4734-ad44-86b0356893b0'
        };

        const response: APIGatewayProxyResult = await deleteProductHandler(e, fakeContext);
        expect(response).to.be.not.null;
        await createProduct(expectedProduct);

    });

    it('Vendor not working delete', async () => {
        AWS.config.update({ region: process.env.REGION });
        const test = await TestUser.fromRole(true, process.env.USER_POOL_ID);
        const e: IFakeEvent = {
            headers: {
                AccessToken: await test.getAccessToken()
            },
            pathParameters: 'Not existing at all'
        };
        const response: APIGatewayProxyResult = await deleteProductHandler(e, fakeContext);
        expect(response.statusCode, 'response.statusCode').to.be.equal(StatusCodes.NOT_FOUND);

        const body = JSON.parse(response.body);
        expect(body.error.name).to.be.equal('ItemNotFoundException');

    });

    it('Customer delete', async () => {
        AWS.config.update({ region: process.env.REGION });
        const test = await TestUser.fromRole(false, process.env.USER_POOL_ID);
        const e: IFakeEvent = {
            headers: {
                AccessToken: await test.getAccessToken()
            },
            pathParameters: '484cdb36-c10f-4734-ad44-86b0356893b0',
        };
        const response: APIGatewayProxyResult = await deleteProductHandler(e, fakeContext);
        expect(response, 'response').to.be.not.null;
        expect(response.statusCode, 'response.statusCode').to.be.equal(StatusCodes.FORBIDDEN);

        const body = JSON.parse(response.body);
        expect(body.error.name, 'body.error.name').to.be.equal('UserNotAllowed');

    });
});