import 'source-map-support/register';

import Product from '@dbModel/tables/product';
import decreaseAvailability from './function';
import { ValidatedEventSQSEvent, middyfy } from 'utilities-techsweave';
import schema from './schema';
/*
 * Remember: event.body type is the type of the instantiation of ValidatedEventAPIGatewayProxyEvent
 * In this case event.body type is 'void' -> we have no body!
*/
const getProductHandler: ValidatedEventSQSEvent<typeof schema> = async (event) => {

    try {
        const product: Product = new Product();
        product.id = event.Records[0].messageAttributes.id.stringValue;
        product.availabilityQta = parseInt(event.Records[0].messageAttributes.availabilityQta.stringValue);
        await decreaseAvailability(product);
    }
    catch (error) {
        //console.log prints to AWS CloudWatch
        console.log('EVENT:');
        console.log(event);
        console.log('ERROR:');
        console.log(error);
    }
};

export const main = middyfy(getProductHandler);
