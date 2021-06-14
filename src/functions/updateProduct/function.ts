import dbContext from '@dbModel/dbContext';
import Product from '@dbModel/tables/product';
import getProduct from '@functions/getProduct/function';
import createProduct from '@functions/createProduct/function';

const updateProduct = async (item: Product): Promise<Product> => {
    const product = await getProduct(item.id, true);

    if (
        item.title != product.title ||
        item.description != product.description ||
        item.categorieId != product.categorieId ||
        item.customSpecs != product.customSpecs
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
        return createProduct(newProduct);
    } else {
        return dbContext.update(item, { onMissing: 'skip' });
    }
};

export default updateProduct;



//serverless invoke local --function updateProduct --data '{"pathParameters": {"id":"484cdb36-c10f-4734-ad44-86b0356893b0"}, "body":{"categorieId":"newCategorie2", "isSalable": "true"}, "headers":{"AccessToken": "eyJraWQiOiJWSVA1Tk5QTm1HZHVNR244Tlo5OVBTM2JzWWNlSXpiRmx6STJYVEFuSkJnPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiIwZjI1ODQyMi02NTc1LTQwODItYWYxNi0xYWViMDhkYTliZmEiLCJjb2duaXRvOmdyb3VwcyI6WyJWZW5kb3IiXSwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLmV1LWNlbnRyYWwtMS5hbWF6b25hd3MuY29tXC9ldS1jZW50cmFsLTFfZWNpRVV2d3pwIiwidmVyc2lvbiI6MiwiY2xpZW50X2lkIjoiN3YwOWRsZGE3cjVwam5qY2l1bDdnOGpyYWgiLCJldmVudF9pZCI6ImM0NTc1ZGZlLWM4MzYtNDJiOS1iMDAxLWNmNGI0Mjk1NWM3MCIsInRva2VuX3VzZSI6ImFjY2VzcyIsInNjb3BlIjoiYXdzLmNvZ25pdG8uc2lnbmluLnVzZXIuYWRtaW4gb3BlbmlkIHByb2ZpbGUgZW1haWwiLCJhdXRoX3RpbWUiOjE2MjM2ODcwMjEsImV4cCI6MTYyMzY5MDYyMSwiaWF0IjoxNjIzNjg3MDIxLCJqdGkiOiJlZTI5NzUwNS1kMjViLTRkMTQtOWU3OC0wNTkyNmQxMjkxMjEiLCJ1c2VybmFtZSI6InRlc3R2ZW5kb3IifQ.mMXqdS2GBa4_eIDXoJlaSTQqeyDYbRn69pz1YctpJ3eIGKGvlXFHAftnaRBUxtaqBQ2dqVyRauTOJfY5cHWTEt5gR-h3UAxgmluM5n8BA36WQ7lsG71PSn3mpQT4INiuqMEsWsJaCDjYHSjtSkFiIpkykG_yv8fNsX-Kz75f7jI7mvmD4XgNX2WLbBMsUIhvi8-9Q6wUaC33hcdyPFsRxKTXln3H4cUCJtoyQZGnEge0vmZ-2SjGchQg9Q-5nEcilmkRck39N_c6Xlw45fll2BEww_q9s-jaA1M5-78e4xWqAz4JQIU_O7iGbDHW-euinBJF8hvpXyW3aFQX7VVTTQ", "IdToken": "eyJraWQiOiJiWENiOVF2cW9TWG1xaHBJanAyMHR6UkRBSDliT1dtZ200YjBQTDk0ekc0PSIsImFsZyI6IlJTMjU2In0.eyJhdF9oYXNoIjoiY2o2ZllmVUpNRllNeW5hQ2FrUHJYdyIsInN1YiI6IjBmMjU4NDIyLTY1NzUtNDA4Mi1hZjE2LTFhZWIwOGRhOWJmYSIsImNvZ25pdG86Z3JvdXBzIjpbIlZlbmRvciJdLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiYWRkcmVzcyI6eyJmb3JtYXR0ZWQiOiJ2aWEgbHVpZ2kgMjcifSwiYmlydGhkYXRlIjoiMDJcLzEyXC8xOTI1IiwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLmV1LWNlbnRyYWwtMS5hbWF6b25hd3MuY29tXC9ldS1jZW50cmFsLTFfZWNpRVV2d3pwIiwicGhvbmVfbnVtYmVyX3ZlcmlmaWVkIjpmYWxzZSwiY29nbml0bzp1c2VybmFtZSI6InRlc3R2ZW5kb3IiLCJhdWQiOiI3djA5ZGxkYTdyNXBqbmpjaXVsN2c4anJhaCIsImV2ZW50X2lkIjoiYzQ1NzVkZmUtYzgzNi00MmI5LWIwMDEtY2Y0YjQyOTU1YzcwIiwidG9rZW5fdXNlIjoiaWQiLCJhdXRoX3RpbWUiOjE2MjM2ODcwMjEsIm5hbWUiOiJWZW5kb3IiLCJwaG9uZV9udW1iZXIiOiIrMzkzNDYxMjM0NTY3IiwiZXhwIjoxNjIzNjkwNjIxLCJpYXQiOjE2MjM2ODcwMjEsImZhbWlseV9uYW1lIjoiUm9zc2kiLCJlbWFpbCI6InBheGlrZTk1ODBAam1wYW50LmNvbSJ9.OoKOYuEfZrNtTgPMP40DsRh87-SnKXsBsqzF6YWxTM_gEq79VKcCueueAHMEGYerGgWhI73lP14XlfWvJkELri3e3OQnsxLMPmLo87KPn0fRW1l0pKs0iE-PEemFvXfrdV4vA-b77VEap2g3QE5JV1Inv_uupcDP22qbjl9F2H4upD9yvL5froXjQQIN3DjmoLlhFEaQfCWLd7gXjgajC3shDdFU206Q22h5bmhvYniI4fl7cZ6k4p9vugweCFp1l36-dvDGfK2wsebbWUYrCshiDGa2EN0n1cWtPsqL1eaKkl1caeJtMNeq211BNwwZE57DRggbwRlPjDnSFUZ7KA"}}'