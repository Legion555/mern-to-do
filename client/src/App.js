import {useState, useEffect} from 'react';
import './App.css';
import axios from 'axios';

function App() {
  const [userData, setUserData] = useState([{name: 'bill', age: '12'}]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const getData = (id) => {
    axios.get('./api/posts/' + id)
    .then((res) => {
      console.log(res.data[0]);
      setUserData([res.data[0]])
    })
    .catch((error) => {
      console.error("meh " + error)
    })
  }


  const getId = (token) => {
    axios.get('./api/posts', {
      headers: {
        'auth-token': token
      }
    })
    .then((res) => {
      getData(res.data._id);
      console.log(res.data._id);
    })
    .catch((error) => {
      console.error("Oh no " + error)
    })
  }

  const login = (e) => {
    e.preventDefault();
    const details = {
      email: email,
      password: password
    }
    axios.post('/api/user/login', details)
    .then(function (response) {
      getId(response.headers["auth-token"]);
    })
  }
  // setItem('token', response.headers.get('auth-token'));

  const toggleView = () => {
    // counter === true ? setCounter(false) : setCounter(true);
    console.log(userData);  
  }

  return (
    <div className="app">
        <form className="input-main">
          <input onChange={(e) => setEmail(e.target.value)} placeholder="email..." name="email" value={email}></input>
          <input onChange={(e) => setPassword(e.target.value)} placeholder="password..." name="password" value={password}></input>
          <button onClick={login} className="button">Login</button>
        </form>
      <h1>User info:</h1>
      <button onClick={toggleView}>View data</button>
      {userData.map(item => 
        <div key={item._id}>
          <p>{item.name}</p>
        </div>
        )
      }
    </div>
  );
}

export default App;
