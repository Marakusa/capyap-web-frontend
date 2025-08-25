import config from './local.config.json';
import { io } from 'socket.io-client';

const URL = config.backend.url;

export const socket = io(URL);
