import { expect } from 'chai';
import getProduct from '../../src/functions/getProduct/function';
import Product from '../../src/models/database/tables/product';

describe('function: getProduct', async () => {
    it('Not Working get', async () => {
        try {
            expect(await getProduct('Not existing id')).to.be.null;
        } catch (error) {
            expect(error.name).equal('ItemNotFoundException');
        }
    });
    it('Working get', async () => {
        try {
            const expectedProduct: Product = {
                id: '484cdb36-c10f-4734-ad44-86b0356893b0',
                title: 'black t-shirt',
                description: 'A beautiful black t-shirt',
                SKU: 'SKU12345',
                price: 20,
                availabilityQta: 20
            };
            expect(await getProduct('484cdb36-c10f-4734-ad44-86b0356893b0')).to.be.deep.equal(expectedProduct);
        } catch (error) {
            expect(error.message).to.be.null;
        }
    });
});