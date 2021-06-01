// import chai from 'chai';
import { expect } from 'chai';
import getProduct from '../../src/functions/getProduct/function';
import deleteProduct from '../../src/functions/deleteProduct/function';
import Product from '../../src/models/database/tables/product';
import createProduct from '../../src/functions/createProduct/function';


describe('function: deleteProduct', async () => {
    const expectedProduct: Product = new Product();
    expectedProduct.id = '484cdb36-c10f-4734-ad44-86b0356893b0';
    expectedProduct.title = 'black t-shirt';
    expectedProduct.description = 'A beautiful black t-shirt';
    expectedProduct.price = 20;
    expectedProduct.availabilityQta = 20;
    expectedProduct.SKU = 'SKU12345';

    it('Working delete', async () => {
        try {
            expect(await deleteProduct('484cdb36-c10f-4734-ad44-86b0356893b0')).to.be.deep.equal(expectedProduct);
        } catch (error) {
            expect(error.name).to.be.null;
        }

        try {
            expect(await getProduct('484cdb36-c10f-4734-ad44-86b0356893b0')).to.be.null;
        } catch (error) {
            expect(error.name).equal('ItemNotFoundException');
        }

        await createProduct(expectedProduct);
    });

    it('Not working delete', async () => {
        try {
            expect(await deleteProduct('Not existing')).to.be.undefined;
        } catch (error) {
            expect(error.name).equal('ItemNotFoundException');
        }
    });
});
