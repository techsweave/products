// import chai from 'chai';
import { expect } from 'chai';
import updateProduct from '../../src/functions/updateProduct/function';
import Product from '../../src/models/database/tables/product';


describe('function: updateProductTest', async () => {
    const expectedProduct: Product = new Product();
    expectedProduct.id = '484cdb36-c10f-4734-ad44-86b0356893b0';
    expectedProduct.title = 'white t-shirt';
    expectedProduct.description = 'A beautiful white t-shirt';
    expectedProduct.price = 20;
    expectedProduct.availabilityQta = 20;
    expectedProduct.SKU = 'SKU12345';


    it('Working update', async () => {
        try {
            const testedProduct: Product = new Product();
            testedProduct.id = '484cdb36-c10f-4734-ad44-86b0356893b0';
            testedProduct.title = 'white t-shirt';
            testedProduct.description = 'A beautiful white t-shirt';
            expect(await updateProduct(testedProduct)).to.be.deep.equal(expectedProduct);
        } catch (error) {
            expect(error.name).to.be.null;
        }

        //undo changes
        expectedProduct.title = 'black t-shirt';
        expectedProduct.description = 'A beautiful black t-shirt';
        await updateProduct(expectedProduct);
    });

    // it('Not working update', async () => {
    //     const testedProduct: Product = new Product();
    //     testedProduct.id = 'Not existing';
    //     testedProduct.title = 'white t-shirt';
    //     testedProduct.description = 'A beautiful white t-shirt';
    //     try {
    //         expect(await updateProduct(testedProduct)).to.be.undefined;
    //     } catch (error) {
    //         expect(error.name).equal('ItemNotFoundException');
    //     }
    // });
});
