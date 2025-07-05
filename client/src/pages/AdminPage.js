import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { searchSongs } from '../socket';

// const songs = [
// {
//     title: 'Hey Jude',
//     artist: 'The Beatles',
//     file: 'hey_jude.json'
// },
// {
//     title: 'ואיך שלא',
//     artist: 'אריאל זילבר',
//     file: 'veech_shelo.json'
// }]

export default function AdminPage(){
    const navigate = useNavigate();
    const [query, setQuery] = useState('');


    const handleSearch = async (e) => {
        e.preventDefault();
        const res = await searchSongs(query);
        navigate('/results', {state: {results: res}})
    }

    return(
        <div>
            <h2>Search any song...</h2>
            <form onSubmit={handleSearch}>
                <input className="input" type="text" placeholder="Search by title or artist" value={query} onChange={(e) => setQuery(e.target.value)}/>
                <button className="btn" type="submit">Search</button>
            </form>
        </div>

    )
}