import dbContext from '@dbModel/dbContext';
import Product from '@dbModel/tables/product';

const decreaseAvailability = async (id: string, availabilityQta: number): Promise<Product> => {
    const product: Product = new Product();
    product.id = id;
    product.availabilityQta = availabilityQta;
    return dbContext.update(product, { onMissing: 'skip' });
};

export default decreaseAvailability;