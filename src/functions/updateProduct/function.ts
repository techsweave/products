import dbContext from '@dbModel/dbContext';
import Product from '@dbModel/tables/product';
import getProduct from '@functions/getProduct/function';

const updateProduct = async (item: Product): Promise<Product> => {
    await getProduct(item.id);
    return dbContext.update(item, { onMissing: 'skip' });
};

export default updateProduct;