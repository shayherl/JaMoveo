import {useState} from "react";
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

export default function LoginPage(){
    const [formData, setFormData] = useState({username: '', password: ''});
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value})
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const endpoint = 'http://localhost:5000/api/login';
        try {
            const res = await axios.post(endpoint, formData);
            const {token, user} = res.data;
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            if (user.role === 'admin'){
                navigate('/admin');
            }
            else{
                navigate('/player');
            }
        }
        catch(err){
            alert(err.response?.data?.msg || 'Error accured during Login')
        }
    }

    return(
        <form onSubmit={handleSubmit}>
            <h1> Login </h1>
            <input name='username' placeholder='username' onChange={handleChange} required />
            <input type='password' name='password' placeholder='password' onChange={handleChange} required />
            <button type="submit"> Login </button>
            <p> Don't have an account? <Link to="/signup">Sign up here</Link></p>
        </form>
    )
}