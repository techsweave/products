import dbContext from '@dbModel/dbContext';
import Product from '@dbModel/tables/product';

const getProduct = async (id: string, isVendor: boolean): Promise<Product> => {
    const item: Product = new Product();
    item.id = id;
    if (isVendor)
        return dbContext.get(item);
    else {
        const ret = await dbContext.get(item, { projection: ['title', 'SKU', 'description', 'price', 'categorieId', 'discount', 'availabilityQta', 'imageURL', 'tags', 'customSpecs'] });
        if (ret.isSalable)
            return ret;
        throw {
            name: 'ItemNotFoundException',
            message: 'Item is not salable'
        };
    }
};

export default getProduct;