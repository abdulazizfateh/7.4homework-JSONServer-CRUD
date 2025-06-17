// src/api/vercel.js
import jsonServer from 'json-server';
import path from 'path';
import { fileURLToPath } from 'url';

const server = jsonServer.create();
const router = jsonServer.router(path.join(path.dirname(fileURLToPath(import.meta.url)), '../../../database/db.json'));
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(router);

export default function handler(req, res) {
  server(req, res);
}
