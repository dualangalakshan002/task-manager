import client from './client';

export const fetchTasks = (params) =>
  client.get('/tasks', { params }).then((r) => r.data);

export const fetchStats = () =>
  client.get('/tasks/stats').then((r) => r.data);

export const createTask = (payload) =>
  client.post('/tasks', payload).then((r) => r.data);

export const updateTask = (id, payload) =>
  client.put(`/tasks/${id}`, payload).then((r) => r.data);

export const deleteTask = (id) =>
  client.delete(`/tasks/${id}`).then((r) => r.data);
