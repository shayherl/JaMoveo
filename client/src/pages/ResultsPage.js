import { useLocation, useNavigate } from 'react-router-dom';
import {useState} from "react";
import socket from "../socket";
import { getSongDetails } from '../socket';

export default function ResultsPage(){
    const navigate = useNavigate();
    const { state } = useLocation();
    const [message, setMessage] = useState('');
    const results = state?.results || [];
    const handleSelect = async (song) => {
        try{
            const data = await getSongDetails(song.link);
            sessionStorage.setItem('currentSong', JSON.stringify(data));
            socket.emit('selected-song', data);
            setMessage(`${song.title} selected and broadcasted to all players`);
            setTimeout(() => {
                navigate('/live');
                }, 2000);
        }
        catch(err){
            alert(err.response?.data?.msg || 'Error accured during song selection')
        }
    }
    const handleBackToAdmin = () => {
            navigate('/admin');
    };
    return(
        <div>
            {message && (<div className="alert alert-success"> {message} </div>)}
            <h2>Search results:</h2>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', direction: 'rtl' }}>
              {results.map(song => (
                <div key={song.title} className="song-result" onClick={() => handleSelect(song)}>
                  {song.photo && (
                    <img src={song.photo} alt={song.artist}/>
                  )}
                  <span style={{ fontSize: '18px', fontWeight: '500' }}>
                    {song.title} - {song.artist}
                  </span>
                </div>
              ))}
            </div>

            <button className="btn" onClick={handleBackToAdmin} style={{marginTop: '20px', padding: '10px 15px', cursor: 'pointer'}}>
                Back to search
            </button>
        </div>
    )
}