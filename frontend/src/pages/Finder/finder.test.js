import api from '../../services/api';

it('returns array of products', async () => {
    const token = await api.post('/login', { 'email':'benoit.praet@hotmail.be', 'password':'test' });
    const products = await api.get('/products/notseen', { headers: { 'userToken': token.data.userToken } });

    expect(Array.isArray(products.data)).toBe(true);
});