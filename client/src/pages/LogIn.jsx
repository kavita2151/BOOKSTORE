import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authActions } from '../store/auth';
import { useState }from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
const LogIn = () => {
  const [Values, setValues] = useState({
    username: '',
    password: '',
  });
const navigate = useNavigate();
const dispatch = useDispatch();
  const change=(e) =>{
    const { name, value }=e.target;
    setValues({...Values, [name]:value});
};
const submit =async()=>{

try{
    if(Values.username ==="" ||
        Values.password ==="" 
    ){
        alert("All fields are required");
    }
    else{
        const response = await axios.post(
            "http://localhost:1000/api/v1/sign-in" ,Values
        );
       dispatch(authActions.login());
       dispatch(authActions.changeRole(response.data.role ));
       localStorage.setItem("id",response.data.id);
        localStorage.setItem("token",response.data.token);
        localStorage.setItem("role",response.data.role );
       navigate("/profile");
    }

}catch(error){
    alert(error.response.data.message);
}
}
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-lg w-80 shadow-md">
        <h2 className="text-2xl font-semibold text-center text-white mb-6">Log In</h2>

        <label className="text-sm text-gray-300">Username</label>
        <input
          type="text"
          name="username"
          placeholder="username"
          value={Values.username}
          onChange={change}
          required
          className="w-full px-3 py-2 mb-4 text-gray-200 bg-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <label className="text-sm text-gray-300">Password</label>
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={Values.password}
          onChange={change}
          required
          className="w-full px-3 py-2 mb-4 text-gray-200 bg-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button type="button" className="w-full py-2 mt-4 text-white bg-blue-600 rounded hover:bg-blue-700 focus:outline-none"
        onClick={submit}>
          Log In
        </button>
        
        <div className="text-center mt-4 text-gray-400">
          <p>
            Don’t have an account? <Link to="/signup" className="text-blue-500 hover:underline">Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LogIn;
