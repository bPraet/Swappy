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

it('returns "Missing field" message', async () => {
    const response = await api.put(`/product/update/5ffd94423f95276b283d63d3`, {"name":"test"}, { headers: { 'userToken': token } });

    expect(response.data).toEqual('Missing field');
});