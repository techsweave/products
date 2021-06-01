import { main as createProductHandler } from '../../src/functions/createProduct/handler';
import { expect } from 'chai';
import { fakeContext, IFakeEvent, TestUser } from 'utilities-techsweave';
// import Product from '../../src/models/database/tables/product';
import * as AWS from 'aws-sdk';
import { APIGatewayProxyResult } from 'aws-lambda';
import deleteProduct from '../../src/functions/deleteProduct/function';
import { StatusCodes } from 'http-status-codes';

describe('handler: createProduct', async () => {
    it('Vendor creation', async () => {
        AWS.config.update({ region: process.env.REGION });
        const test = await TestUser.fromRole(true, process.env.USER_POOL_ID);
        const e: IFakeEvent = {
            headers: {
                AccessToken: await test.getAccessToken()
            },
            body: {
                title: 'a',
            }
        };
        try {
            const response: APIGatewayProxyResult = await createProductHandler(e, fakeContext);
            expect(response).to.be.not.null;
            expect(response.statusCode).to.be.equal(StatusCodes.CREATED);

            const body = JSON.parse(response.body);
            await deleteProduct(body.id);

        } catch (error) {
            expect(error.name).to.be.null;
        }
    });

    it('Customer creation', async () => {
        AWS.config.update({ region: process.env.REGION });
        const test = await TestUser.fromRole(false, process.env.USER_POOL_ID);
        const e: IFakeEvent = {
            headers: {
                AccessToken: await test.getAccessToken()
            },
            // pathParameters: '',
            body: {
                title: 'a',
            }
        };
        const response: APIGatewayProxyResult = await createProductHandler(e, fakeContext);
        expect(response, 'response').to.be.not.null;
        expect(response.statusCode, 'statusCode').to.be.equal(StatusCodes.FORBIDDEN);

        const body = JSON.parse(response.body);
        expect(body.error.name, 'body.error.name').to.be.equal('UserNotAllowed');

    });
});