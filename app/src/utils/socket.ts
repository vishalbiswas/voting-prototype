import { io } from 'socket.io-client';
import { API_URL } from './constants';

const url = import.meta.env.NODE_ENV === 'production' ? window.location.href : API_URL;

export const socket = io(url);