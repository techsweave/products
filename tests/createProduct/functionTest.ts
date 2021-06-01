// import chai from 'chai';
import { expect } from 'chai';
import createProduct from '../../src/functions/createProduct/function';
import deleteProduct from '../../src/functions/deleteProduct/function';
import Product from '../../src/models/database/tables/product';


describe('function: createProduct', async () => {
    it('Working creation', async () => {
        try {
            const product = new Product();
            product.title = 'testProduct';
            product.price = 20;

            const ret = await createProduct(product);
            
            expect(ret).contains(product);
            await deleteProduct(ret.id);
        } catch (error) {
            expect(error.name).to.be.null;
        }
    });
});
