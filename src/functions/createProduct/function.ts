import dbContext from '@dbModel/dbContext';
import Product from '@dbModel/tables/product';


const createProduct = async (item: Product): Promise<Product> => {
    if (await dbContext.query(Product, { SKU: item.SKU }).count == 0)
        throw {
            name: 'DuplicateSKU',
            message: 'Can\'t create a product whit already existing SKU'
        };
    return dbContext.put(item);
};

export default createProduct;