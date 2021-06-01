import dbContext from '@dbModel/dbContext';
import Product from '@dbModel/tables/product';
import getProduct from '@functions/getProduct/function';

const deleteProduct = async (id: string): Promise<Product> => {
    await getProduct(id);
    const item: Product = new Product();
    item.id = id;
    return dbContext.delete(item);
};

export default deleteProduct;