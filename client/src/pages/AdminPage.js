import { useState } from "react";
import { useNavigate } from 'react-router-dom';

const songs = [
{
    title: 'Hey Jude',
    artist: 'The Beatles',
    file: 'hey_jude.json'
},
{
    title: 'ואיך שלא',
    artist: 'אריאל זילבר',
    file: 'veech_shelo.json'
}]

export default function AdminPage(){
    const navigate = useNavigate();
    const [query, setQuery] = useState('');


    const handleSearch = () => {
        const filtered_songs = songs.filter(song => song.title.toLowerCase().includes(query.toLowerCase()) || song.artist.toLowerCase().includes(query.toLowerCase()))
        navigate('/results', {state: {results: filtered_songs}})
    }

    return(
        <div>
            <h2>Search any song...</h2>
            <input type="text" placeholder="Search by title or artist" value={query} onChange={(e) => setQuery(e.target.value)}/>
            <button onClick={handleSearch}>Search</button>
        </div>

    )
}