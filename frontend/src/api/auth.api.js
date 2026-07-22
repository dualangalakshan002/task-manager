import client from './client';

export const loginRequest = (email, password) =>
  client.post('/auth/login', { email, password }).then((r) => r.data);
