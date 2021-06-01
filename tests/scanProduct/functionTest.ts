import { expect } from 'chai';
import scanProduct from '../../src/functions/scanProduct/function';
// import Product from '../../src/models/database/tables/product';

describe('function: scanProductTest', async () => {
    it('Working scan', async () => {
        try {
            const filter = {
                limit: 10
            };
            expect(await scanProduct(filter)).not.to.be.null;
        } catch (error) {
            expect(error.name).equal('ItemNotFoundException');
        }
    });

    // it('Working scan', async () => {
    //     try {
    //         const product: Product = new Product();
    //         product.id = '484cdb36-c10f-4734-ad44-86b0356893b0';
    //         product.title = 'black t-shirt';
    //         product.availabilityQta = 20;
    //         product.price = 20;
    //         product.description = 'A beautiful black t-shirt';
    //         expect(await scanProduct('484cdb36-c10f-4734-ad44-86b0356893b0')).to.be.equal(product);
    //     } catch (error) {
    //         expect(error.message).to.be.null;
    //     }
    // });
});

