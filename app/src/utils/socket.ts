import { io } from 'socket.io-client';

const URL = import.meta.env.NODE_ENV === 'production' ? window.location.href : 'http://localhost:5000';

export const socket = io(URL);