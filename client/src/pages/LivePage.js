import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LyricsOnly from '../components/LyricsOnly';
import SongWithChords from '../components/SongWithChords';
import socket from "../socket";

export default function LivePage(){
    const [song, setSong] = useState(() => {
        const stored = localStorage.getItem('currentSong');
        return stored ? JSON.parse(stored) : null;
    });
    const [autoScroll, setAutoScroll] = useState(false);
    const user = JSON.parse(localStorage.getItem('user'));
    const isSinger = user.instrument?.toLowerCase().includes('singer');
    const navigate = useNavigate();

    useEffect(() => {
        const handleSong = (newSong) => {
            localStorage.setItem('currentSong', JSON.stringify(newSong));
            setSong(newSong);
        };

        const handleQuit = () => {
            localStorage.removeItem('currentSong');
            navigate(user.role === 'admin' ? '/admin' : '/player');
        }

        socket.on('song-selected', handleSong);
        socket.on('session-ended', handleQuit);

        return () => {
            socket.off('song-selected', handleSong);
            socket.off('session-ended', handleQuit);
        };
    }, [navigate]);

    useEffect(() =>{
        let scrollInterval;
        if (autoScroll){
            scrollInterval = setInterval(() => {
                window.scrollBy(0,1);
            }, 50)
        }
        else{
            clearInterval(scrollInterval);
        }
        return () => clearInterval(scrollInterval);
    }, [autoScroll]);

    const handleQuit = () =>{
        socket.emit('quit-session');
    }

    if (!song) return <h2>Loading...</h2>;

    return(
        <div>
            <h1>{song.title} by {song.artist}</h1>
            {isSinger ? <LyricsOnly content={song.content} /> : <SongWithChords content={song.content} />}
            <button onClick={() => setAutoScroll(!autoScroll)}>
                {autoScroll ? 'Stop scrolling' : 'Start scrolling'}
            </button>

            {user.role === 'admin' && (
                <button onClick={handleQuit}>Quit</button>
            )}
        </div>
    )
}