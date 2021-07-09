import api from '../../services/api';

let token;

beforeAll((done) => {
    api.post('/login', { 'email':'benoit.praet@hotmail.be', 'password':'test' }).then((res) => {token = res.data.userToken; done()});
})

it('returns details of product', async () => {
    const product = await api.get('/product/5ffd94423f95276b283d63d3', { headers: { 'userToken': token } });

    expect(product.data.name).toEqual('Produit test');
});

it('returns products of user', async () => {
    const products = await api.get('/productsUser', { headers: { 'userToken': token } });

    expect(products.data[0].name).toEqual('Produit test');
});

it('returns 400 due to missing field', async () => {
    try{
        await api.put(`/product/update/5ffd94423f95276b283d63d3`, {"name":"test"}, { headers: { 'userToken': token } });
    } catch(error){
        expect(error.response.status).toEqual(400);
    }
});

it('returns "Nothing to delete" message', async () => {
    const response = await api.delete(`/product/delete/1234`, { headers: { 'userToken': token } });

    expect(response.data).toEqual('Nothing to delete');
});

it('returns 400 due to missing field', async () => {
    try{
        await api.post(`/product/add/`, {"name":"test"}, { headers: { 'userToken': token } });
    } catch(error){
        expect(error.response.status).toEqual(400);
    }
});