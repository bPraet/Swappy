import api from '../../services/api';

it('returns details of product', async () => {
    const token = await api.post('/login', { 'email':'benoit.praet@hotmail.be', 'password':'test' });
    const response = await api.post('/match/add', { }, { headers: { 'userToken': token.data.userToken }});

    expect(response.data).toEqual('Field missing');
});