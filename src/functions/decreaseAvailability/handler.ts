import 'source-map-support/register';

import decreaseAvailability from './function';
import { ValidatedEventSQSEvent, middyfy } from 'utilities-techsweave';
import schema from './schema';
/*
 * Remember: event.body type is the type of the instantiation of ValidatedEventAPIGatewayProxyEvent
 * In this case event.body type is 'void' -> we have no body!
*/
const getProductHandler: ValidatedEventSQSEvent<typeof schema> = async (event) => {

    try {
        await decreaseAvailability(event.Records[0].messageAttributes.id.stringValue, parseInt(event.Records[0].messageAttributes.availabilityQta.stringValue));
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
