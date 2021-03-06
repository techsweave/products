import dbContext from '@dbModel/dbContext';
import Product from '@dbModel/tables/product';

const getProduct = async (id: string, isVendor: boolean): Promise<Product> => {
    const item: Product = new Product();
    item.id = id;
    const product = await dbContext.get(item);
    if (isVendor)
        return product;
    else {
        if (product.isSalable) {
            const ret: Product = Object.assign({
                id: product.id,
                title: product.title,
                SKU: product.SKU,
                description: product.description,
                price: product.price,
                categorieId: product.categorieId,
                discount: product.discount,
                availabilityQta: product.availabilityQta,
                imageURL: product.imageURL,
                tags: product.tags,
                customSpecs: product.customSpecs
            });
            return ret;
        } else {
            throw {
                name: 'ItemNotFoundException',
                message: 'Item is not salable'
            };
        }
    }
};

export default getProduct;