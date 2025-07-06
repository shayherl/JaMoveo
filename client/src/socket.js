import { io } from 'socket.io-client';
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const socket = io(BASE_URL, {
  withCredentials: true,
  transports: ['websocket'],
});

export async function searchSongs(query) {
  const res = await axios.get(`${BASE_URL}/api/tab4u/search?q=${query}`);
  return res.data;
}

export async function getSongDetails(link) {
  const res = await axios.get(`${BASE_URL}/api/tab4u/song?link=${encodeURIComponent(link)}`);
  return res.data;
}

export default socket;
