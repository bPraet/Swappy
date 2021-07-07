import api from '../../services/api';

it('returns details of product', async () => {
    const token = await api.post('/login', { 'email':'benoit.praet@hotmail.be', 'password':'test' });
    const product = await api.get('/product/600a961f8ccd8226387153bc', { headers: { 'userToken': token.data.userToken } });

    expect(product.data.name).toEqual('Piéton');
});

it('return products of user', async () => {
    const token = await api.post('/login', { 'email':'benoit.praet@hotmail.be', 'password':'test' });
    const products = await api.get('/productsUser', { headers: { 'userToken': token.data.userToken } });

    expect(products.data[0].name).toEqual('Produit test');
});