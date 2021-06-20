import dbContext from '@dbModel/dbContext';
import Product from '@dbModel/tables/product';
import getProduct from '@functions/getProduct/function';
import createProduct from '@functions/createProduct/function';
import * as AWS from 'aws-sdk';
const updateProduct = async (item: Product): Promise<Product> => {
    const product = await getProduct(item.id, true);
    const sns = new AWS.SNS();

    if (
        item.title != undefined ||
        item.description != undefined ||
        item.categorieId != undefined ||
        item.customSpecs != undefined
    ) {
        product.isSalable = false;
        await dbContext.update(product, { onMissing: 'skip' });

        const newProduct = Object.assign(new Product(), {
            title: item.title ? item.title : product.title,
            description: item.description ? item.description : product.description,
            price: item.price ? item.price : product.price,
            discount: item.discount ? item.discount : product.discount,
            availabilityQta: item.availabilityQta ? item.availabilityQta : product.availabilityQta,
            imageURL: item.imageURL ? item.imageURL : product.imageURL,
            isSalable: item.isSalable ? item.isSalable : product.isSalable,
            categorieId: item.categorieId ? item.categorieId : product.categorieId,
            notes: item.notes ? item.notes : product.notes,
            tags: item.tags ? item.tags : product.tags,
            customSpecs: item.customSpecs ? item.customSpecs : product.customSpecs,
        });
        await sns.publish({
            Message: 'createdNewProduct',
            MessageAttributes: {
                productId: {
                    DataType: 'String',
                    StringValue: item.id,
                }
            },
            TopicArn: 'arn:aws:sns:eu-central-1:780844780884:changeCartOnUpdate'
        }).promise();
        return createProduct(newProduct);

    } else {
        await sns.publish({
            Message: 'updatedProduct',
            MessageAttributes: {
                productId: {
                    DataType: 'String',
                    StringValue: item.id,
                }
            },
            TopicArn: 'arn:aws:sns:eu-central-1:780844780884:changeCartOnUpdate',
        }).promise();
        return dbContext.update(item, { onMissing: 'skip' });
    }
};

export default updateProduct;



//serverless invoke local --function updateProduct --data '{"pathParameters": {"id":"2ff3077c-9466-4a92-9b59-44cc5e279adc"}, "body":{"price":"50"}, "headers":{"AccessToken": "eyJraWQiOiJWSVA1Tk5QTm1HZHVNR244Tlo5OVBTM2JzWWNlSXpiRmx6STJYVEFuSkJnPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiIwZjI1ODQyMi02NTc1LTQwODItYWYxNi0xYWViMDhkYTliZmEiLCJjb2duaXRvOmdyb3VwcyI6WyJWZW5kb3IiXSwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLmV1LWNlbnRyYWwtMS5hbWF6b25hd3MuY29tXC9ldS1jZW50cmFsLTFfZWNpRVV2d3pwIiwidmVyc2lvbiI6MiwiY2xpZW50X2lkIjoiN3YwOWRsZGE3cjVwam5qY2l1bDdnOGpyYWgiLCJldmVudF9pZCI6IjJkZTdiNmFlLTk3NWUtNDBjNC1hZGUwLTA2YzlmZDM4ODRmZiIsInRva2VuX3VzZSI6ImFjY2VzcyIsInNjb3BlIjoiYXdzLmNvZ25pdG8uc2lnbmluLnVzZXIuYWRtaW4gb3BlbmlkIHByb2ZpbGUgZW1haWwiLCJhdXRoX3RpbWUiOjE2MjM4NTg0OTIsImV4cCI6MTYyMzg2MjA5MiwiaWF0IjoxNjIzODU4NDkyLCJqdGkiOiIxNWY1MDQ4MC0zNjVjLTRjYTAtYTFkMi0zZDg1N2FlNTUxZmEiLCJ1c2VybmFtZSI6InRlc3R2ZW5kb3IifQ.ExcuhZIIuCvBtRkO1YPhfRVy1hixuy8E8ro_D3W1bclCCXu_Q1n3bBoUsP6NA19J3E4lzNubDedf_jlXKYYlaGFJvhkVuGccydpjCWB5T9WR8_U43EdMxarydYmxMOOfmZxFQ4BQTGHGD1N0bip-n8ubTzD-gckAnpPClzGZZXSBEsE0ysmm71N81vZtT-U7pzp1YLYHmlSLY0_P2c7L9SNi3CFw4X0xF5udQwFzr29ceH66u2bBVHeMvjTWUTLK26xqLSh5paowvAbkhqFqbVc2EAplNVEHSRax88LWOCHi3NJrK_al6aMxfpwKR4bPqV5NQqUWB1Uz60_p1Oi4QA", "IdToken": "eyJraWQiOiJiWENiOVF2cW9TWG1xaHBJanAyMHR6UkRBSDliT1dtZ200YjBQTDk0ekc0PSIsImFsZyI6IlJTMjU2In0.eyJhdF9oYXNoIjoicGJ5ekFTeTcxOUE5UXk3dEFsd0V3USIsInN1YiI6IjBmMjU4NDIyLTY1NzUtNDA4Mi1hZjE2LTFhZWIwOGRhOWJmYSIsImNvZ25pdG86Z3JvdXBzIjpbIlZlbmRvciJdLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiYWRkcmVzcyI6eyJmb3JtYXR0ZWQiOiJ2aWEgbHVpZ2kgMjcifSwiYmlydGhkYXRlIjoiMDJcLzEyXC8xOTI1IiwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLmV1LWNlbnRyYWwtMS5hbWF6b25hd3MuY29tXC9ldS1jZW50cmFsLTFfZWNpRVV2d3pwIiwicGhvbmVfbnVtYmVyX3ZlcmlmaWVkIjpmYWxzZSwiY29nbml0bzp1c2VybmFtZSI6InRlc3R2ZW5kb3IiLCJhdWQiOiI3djA5ZGxkYTdyNXBqbmpjaXVsN2c4anJhaCIsImV2ZW50X2lkIjoiMmRlN2I2YWUtOTc1ZS00MGM0LWFkZTAtMDZjOWZkMzg4NGZmIiwidG9rZW5fdXNlIjoiaWQiLCJhdXRoX3RpbWUiOjE2MjM4NTg0OTIsIm5hbWUiOiJWZW5kb3IiLCJwaG9uZV9udW1iZXIiOiIrMzkzNDYxMjM0NTY3IiwiZXhwIjoxNjIzODYyMDkyLCJpYXQiOjE2MjM4NTg0OTIsImZhbWlseV9uYW1lIjoiUm9zc2kiLCJlbWFpbCI6InBheGlrZTk1ODBAam1wYW50LmNvbSJ9.FwpBpKZkA8h9jSywpPPhb2OGSLYSRK5KES-mpbtpFltpwOo0HlmVjjNb60D-Bk8ExoUzbg0qx2tDPFI_o5hn-zX6VEpTSBq1C_0SriNU6Ka0hKKuNaME8sWGlUi9OWWd21wba3nIF3w-GcgfrmHcnC2FQY9SX-KYDjH47VejsDt5QGVlPLBwNJuhOx2ovZdkNkPmfcJ-o2-YhDa_zdHSvRoNkrWJ_0MIZlRLzkMfoEK57UFw1ZmxLHF5VrQ2FfBShG-D_W-UfN-K1sCiaaRq2bXMKsB3E2sCMIYCbjhEdl4hxlG9BGyTsDerleVcHlO9i-vQSpmAZ6jjoreBayzbng"}}'
