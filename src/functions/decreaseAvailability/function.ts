import dbContext from '@dbModel/dbContext';
import Product from '@dbModel/tables/product';

const decreaseAvailability = async (product: Product): Promise<Product> => {
    return dbContext.update(product, { onMissing: 'skip' });
};

export default decreaseAvailability;