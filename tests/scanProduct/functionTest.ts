import { expect } from 'chai';
import scanProduct from '../../src/functions/scanProduct/function';
// import Product from '../../src/models/database/tables/product';

describe('function: scanProductTest', async () => {
    it('Working scan with 10 limit', async () => {
        const filter = {
            limit: 10
        };
        const res = await scanProduct(filter);
        expect(res.items.length).to.be.lessThanOrEqual(10);
    });

    it('Working scan with 1 limit', async () => {
        const filter = {
            limit: 1
        };
        const res = await scanProduct(filter);
        expect(res.items.length).to.be.equal(1);
    });

    // it('Working scan with filter', async () => {
    //     const filter = {
    //         limit: 10,
    //         filter: {
    //             // type: 'And',
    //             // conditions: [
    //             //     {
    //             type: 'Equals',
    //             subject: '484cdb36-c10f-4734-ad44-86b0356893b0',
    //             object: 'id'
    //             //}
    //             //]
    //         }
    //     };
    //     const res = await scanProduct(filter);
    //     expect(res.items.length).to.be.equal(1);
    // });
});

