import { main as updateProductHandler } from '../../src/functions/updateProduct/handler';
import { expect } from 'chai';
import { fakeContext, IFakeEvent, TestUser } from 'utilities-techsweave';
import Product from '../../src/models/database/tables/product';
import * as AWS from 'aws-sdk';
import { APIGatewayProxyResult } from 'aws-lambda';
import updateProduct from '../../src/functions/updateProduct/function';
import { StatusCodes } from 'http-status-codes';

describe('handler: updateProduct', async () => {
    const expectedProduct: Product = new Product();
    expectedProduct.id = '484cdb36-c10f-4734-ad44-86b0356893b0';
    expectedProduct.title = 'white t-shirt';
    expectedProduct.description = 'A beautiful white t-shirt';
    expectedProduct.price = 20;
    expectedProduct.availabilityQta = 20;
    expectedProduct.SKU = 'SKU12345';


    it('Vendor working update', async () => {

        AWS.config.update({ region: process.env.REGION });
        const test = await TestUser.fromRole(true, process.env.USER_POOL_ID);

        const e: IFakeEvent = {
            headers: {
                AccessToken: await test.getAccessToken()
            },
            pathParameters: {
                id: '484cdb36-c10f-4734-ad44-86b0356893b0'
            },
            body: {
                title: 'white t-shirt',
                description: 'A beautiful white t-shirt'
            }
        };

        const response: APIGatewayProxyResult = await updateProductHandler(e, fakeContext);
        expect(response).to.be.not.null;
        expect(response.statusCode).to.be.equal(StatusCodes.OK);

        const body = JSON.parse(response.body);
        expect(body.data).to.be.deep.equal(expectedProduct);

        expectedProduct.title = 'black t-shirt';
        expectedProduct.description = 'A beautiful black t-shirt';

        await updateProduct(expectedProduct);

    });

    it('Vendor not working update', async () => {

        AWS.config.update({ region: process.env.REGION });
        const test = await TestUser.fromRole(true, process.env.USER_POOL_ID);

        const e: IFakeEvent = {
            headers: {
                AccessToken: await test.getAccessToken()
            },
            pathParameters: {
                id: 'Not existing at all'
            },
            body: {
                title: 'white t-shirt',
                description: 'A beautiful white t-shirt'
            }
        };

        const response: APIGatewayProxyResult = await updateProductHandler(e, fakeContext);
        expect(response).to.be.not.null;
        expect(response.statusCode).to.be.equal(StatusCodes.NOT_FOUND);

        await updateProduct(expectedProduct);

    });

    it('Client update', async () => {

        AWS.config.update({ region: process.env.REGION });
        const test = await TestUser.fromRole(false, process.env.USER_POOL_ID);

        const e: IFakeEvent = {
            headers: {
                AccessToken: await test.getAccessToken()
            },
            pathParameters: {
                id: '484cdb36-c10f-4734-ad44-86b0356893b0'
            },
            body: {
                title: 'white t-shirt',
                description: 'A beautiful white t-shirt'
            }
        };
        try {
            const response: APIGatewayProxyResult = await updateProductHandler(e, fakeContext);
            expect(response).to.be.not.null;

            expectedProduct.title = 'black t-shirt';
            expectedProduct.description = 'A beautiful black t-shirt';
            expect(response.statusCode).to.be.equal(StatusCodes.FORBIDDEN);
        } catch (error) {
            expect(error.name).to.be.equal('UserNotAllowed');
        }

    });


});