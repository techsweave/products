import dbContext from '@dbModel/dbContext';
import Product from '@dbModel/tables/product';
import getProduct from '@functions/getProduct/function';

const decreaseAvailability = async (id: string, availabilityQta: number): Promise<Product> => {
    const product: Product = await getProduct(id, true);
    product.availabilityQta -= availabilityQta;
    return dbContext.update(product, { onMissing: 'skip' });
};

export default decreaseAvailability;