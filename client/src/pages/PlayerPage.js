import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import socket from '../socket';

export default function PlayerPage(){
    const navigate = useNavigate();

    useEffect(() => {
        const handleSong = (songData) => {
            localStorage.setItem('currentSong', JSON.stringify(songData));
            navigate('/live');
        };

        const handleQuit = () => {
            localStorage.removeItem('currentSong');
        };

        socket.on('song-selected', handleSong);
        socket.on('session-ended', handleQuit);

        return () => {
            socket.off('song-selected', handleSong);
            socket.off('session-ended', handleQuit);
        };
    }, [navigate]);

    return(
        <h2>Waiting for next song</h2>
    )
}