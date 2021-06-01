import { expect } from 'chai';
import { main as getProductHandler } from '../../src/functions/getProduct/handler';
import { fakeContext, IFakeEvent } from 'utilities-techsweave';
import Product from '../../src/models/database/tables/product';

describe('handler: getProduct', async () => {

    it('Should return a response with a specific Product, if the id exists', async () => {

        const expectedProduct: Product = {
            id: '484cdb36-c10f-4734-ad44-86b0356893b0',
            title: 'black t-shirt',
            description: 'A beautiful black t-shirt',
            SKU: 'SKU12345',
            price: 20,
            availabilityQta: 20
        };

        const event: IFakeEvent = {
            pathParameters: {
                id: '484cdb36-c10f-4734-ad44-86b0356893b0'
            }
        };

        const response = await getProductHandler(event, fakeContext);

        expect(response).to.be.not.null;
        //expect(response.statusCode, 'statusCode').to.be.equal(200);

        const body = JSON.parse(response.body);

        expect(body.count, 'body.count').to.be.equal(1);
        expect(body.data, 'body.data').to.be.deep.equal(expectedProduct);
    });

    it('Should return a response with error ItemNotFoundException, if the id doesn\'t exists', async () => {

        const event: IFakeEvent = {
            pathParameters: {
                id: 'Not Exists At All'
            }
        };

        const response = await getProductHandler(event, fakeContext);

        expect(response).to.be.not.null;
        //expect(response.statusCode, 'statusCode').to.be.equal(404);

        const body = JSON.parse(response.body);

        expect(body.error.name, 'body.error.name').to.be.equal('ItemNotFoundException');
    });
});