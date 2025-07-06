import {useState} from "react";
import axios from 'axios';
import { useNavigate,useLocation, Link } from 'react-router-dom';

export default function SignupPage(){
    const location  = useLocation();
    const navigate = useNavigate();
    const isAdmin = location.pathname === '/admin-signup';

    const [formData, setFormData] = useState({username: '', password: '', instrument: ''});

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value})
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        const endpoint = isAdmin ? `${process.env.REACT_APP_API_BASE_URL}/api/admin-signup` : `${process.env.REACT_APP_API_BASE_URL}/api/signup`;
        try {
            await axios.post(endpoint, formData);
            alert(isAdmin ? 'Admin created' : 'User created')
            navigate('/login');
        }
        catch(err){
            alert(err.response?.data?.msg || 'Error accured during Registration')
        }
    }

    return(
        <form onSubmit={handleSubmit}>
            <h1> {isAdmin ? 'Admin Register' : 'Register'}</h1>
            <input className="input" name='username' placeholder='username' onChange={handleChange} required />
            <input className="input" type='password' name='password' placeholder='password' onChange={handleChange} required />
            <input className="input" name='instrument' placeholder='instrument' onChange={handleChange} required />
            <br/>
            <button className="btn" type="submit"> {isAdmin ? 'Create admin' : 'Create user'}</button>
            <p>Already have an account? <Link to="/login">Log in here</Link></p>
        </form>
    )
}