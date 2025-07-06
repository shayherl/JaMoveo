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
        const endpoint = `${process.env.REACT_APP_API_BASE_URL}/api/login`;
        try {
            const res = await axios.post(endpoint, formData);
            const {token, user} = res.data;
            sessionStorage.setItem('token', token);
            sessionStorage.setItem('user', JSON.stringify(user));
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
            <input className="input" name='username' placeholder='username' onChange={handleChange} required />
            <input className="input" type='password' name='password' placeholder='password' onChange={handleChange} required />
            <br/>
            <button className="btn" type="submit"> Login </button>
            <p> Don't have an account? </p>
            <Link to="/signup">Player sign up</Link>
            <Link to="/admin-signup">Admin sign up here</Link>
        </form>
    )
}