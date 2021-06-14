import dbContext from '@dbModel/dbContext';
import Product from '@dbModel/tables/product';
import { ScanOptions } from '@aws/dynamodb-data-mapper';
import { ConditionExpression } from '@aws/dynamodb-expressions';
import { objectToConditionExpression } from 'utilities-techsweave';


const scanProduct = async (filter: any, isVendor: boolean): Promise<{
    items: Product[],
    lastKey: Partial<Product>
}> => {
    let items: Product[] = [];
    let lastKey: Partial<Product>;
    let conditionFilter = await objectToConditionExpression(filter?.filter);

    const isSalableFilter: ConditionExpression = {
        type: 'Equals',
        subject: 'isSalable',
        object: true
    };

    if (!isVendor) {
        if (conditionFilter == null)
            conditionFilter = isSalableFilter;
        else {
            conditionFilter = {
                type: 'And',
                conditions: [
                    isSalableFilter,
                    conditionFilter
                ]
            };
        }
    }


    const dbFilter: ScanOptions = {
        limit: filter.limit,
        indexName: filter?.indexName,
        pageSize: filter?.pageSize,
        startKey: filter?.startKey,
        filter: conditionFilter,
        projection: isVendor ? undefined : ['title', 'SKU', 'description', 'price', 'categorieId', 'discount', 'availabilityQta', 'imageURL', 'tags', 'customSpecs']
    };

    const paginator = dbContext.scan(Product, dbFilter).pages();

    for await (const page of paginator) {
        items = items.concat(page);
        lastKey = paginator.lastEvaluatedKey;
    }

    return Promise.resolve({
        items: items,
        lastKey: lastKey
    });
};

export default scanProduct;
