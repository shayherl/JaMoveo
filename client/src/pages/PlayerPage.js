import { useEffect, useState  } from 'react';
import { useNavigate } from 'react-router-dom';
import socket from '../socket';

export default function PlayerPage(){
    const navigate = useNavigate();
    const [dots, setDots] = useState('.');

    useEffect(() => {
        const handleSong = (songData) => {
            sessionStorage.setItem('currentSong', JSON.stringify(songData));
            navigate('/live');
        };

        const handleQuit = () => {
            sessionStorage.removeItem('currentSong');
        };

        socket.on('song-selected', handleSong);
        socket.on('session-ended', handleQuit);

        return () => {
            socket.off('song-selected', handleSong);
            socket.off('session-ended', handleQuit);
        };
    }, [navigate]);

    useEffect(() => {
        const interval = setInterval(() => {
            setDots(prev => {
                if (prev.length === 3) return '.';
                return prev + '.';
            });
        }, 500);

        return () => clearInterval(interval);
    }, []);

    return(
        <h2>Waiting for next song{dots}</h2>
    )
}