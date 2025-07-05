import {io} from 'socket.io-client';
import axios from 'axios';

const socket = io('http://localhost:5000')

export async function searchSongs(query) {
  const res = await axios.get(`/api/tab4u/search?q=${query}`);
  return res.data;
}

export async function getSongDetails(link) {
  const res = await axios.get(`/api/tab4u/song?link=${encodeURIComponent(link)}`);
  console.log(res.data)
  return res.data;
}

export default socket;