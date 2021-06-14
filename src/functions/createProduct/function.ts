import dbContext from '@dbModel/dbContext';
import Product from '@dbModel/tables/product';

const createProduct = async (item: Product): Promise<Product> => {
    if (await dbContext.scan(Product, { filter: { type: 'Equals', subject: 'SKU', object: item.SKU }, limit: 1 }).count == 1)
        throw {
            name: 'DuplicateSKU',
            message: 'Can\'t create a product whit already existing SKU'
        };
    return dbContext.put(item);
};

export default createProduct;