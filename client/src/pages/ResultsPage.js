import { useLocation } from 'react-router-dom';
import socket from "../socket";
import { useNavigate } from 'react-router-dom';

export default function ResultsPage(){
    const navigate = useNavigate();
    const { state } = useLocation();
    const results = state?.results || [];
    const handleSelect = async (song) => {
    try{
        const res = await fetch(`/songs/${song.file}`);
        const data = await res.json();
        const fullsong = {
            title: song.title,
            artist: song.artist,
            content: data
        };
        localStorage.setItem('currentSong', JSON.stringify(fullsong));
        socket.emit('selected-song', fullsong);
        alert(`${song.title} selected and broadcasted to all players`);
        navigate('/live');
    }
    catch(err){
        alert(err.response?.data?.msg || 'Error accured during song selection')
    }
}
    return(
        <div>
            <h2>Search results:</h2>
            <div>
                {results.map(song => (
                    <div key={song.title}>
                        <h4>{song.title}</h4>
                        <p>{song.artist}</p>
                        <button onClick={() => handleSelect(song)}>Select</button>
                    </div>
                ))}
            </div>
        </div>
    )
}