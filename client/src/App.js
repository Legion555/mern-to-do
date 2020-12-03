import {useState, useEffect} from 'react';
import './App.css';
import axios from 'axios';

function App() {
  const [userData, setUserData] = useState({});
  const [renderCounter, setRenderCounter] = useState(0);
  const [authView, setAuthView] = useState('');
  //login
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  //Register
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  //Add task
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDesc, setTaskDesc] = useState('');

  useEffect(() => {
  }, [userData]);

  const numGen = () => {
    return Math.floor(Math.random() * 10000);
  }

  const getData = (id) => {
    axios.get('./api/posts/' + id)
    .then((res) => {
      console.log(res.data[0]);
      setUserData(res.data[0])
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
  //Login existing user - pass
  const login = (e) => {
    e.preventDefault();
    const details = {
      email: email,
      password: password
    }
    axios.post('/api/user/login', details)
    .then(function (response) {
      getId(response.headers["auth-token"]);
      setAuthView('loggedIn');
    })
  }
  //Register new user
  const register = (e) => {
    e.preventDefault();
    const payload = {
      name: regName,
      email: regEmail,
      password: regPassword
    }
    axios.post('/api/user/register', payload)
    .then(function (response) {
      setAuthView('registered');
    })
  }
  //Add task to taskList object in user document
  const addTask = (e, id) => {
    e.preventDefault();
    if (taskTitle.length > 0) {
    const newUserData = userData;
    const taskData = {
      "taskTitle": taskTitle,
      "taskDesc": taskDesc,
      "id": numGen()
    }
      newUserData.taskList.push(taskData);
      setUserData(newUserData);
      axios.put("/api/posts/change", userData)
      .then((res) => {
        console.log(res.data);
        setTaskTitle('');
        setTaskDesc('');
      })
      .catch((err) => {
        console.log(err);
      })
    }
  }
  //Remove task from taskList
  const removeTask = (userId, taskId) => {
    const newUserData = userData;
    var removeIndex = newUserData.taskList.map(function(item) { return item.id; }).indexOf(taskId);
    newUserData.taskList.splice(removeIndex, 1);
    setUserData(newUserData);
    axios.put("/api/posts/removeTask", userData)
    .then((res) => {
      console.log(res.data);
      setRenderCounter(renderCounter + 1);
    })
    .catch((err) => {
      console.log(err);
    })
  }

  //Other functions
  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  return (
    <div className="app">
      {/* LOGIN */}
      <div className="auth-container">
        {authView !== 'loggedIn' && <div className="auth-selector">
          <button onClick={() => setAuthView('login')}>Login</button>
          {authView !== 'registered' && <button onClick={() => setAuthView('register')}>Register</button>}
          {(authView === ('login' || 'registered')) && <div className="login-container">
            <form className="input-main">
              <input onChange={(e) => setEmail(e.target.value)} placeholder="email..." name="email" value={email}></input>
              <input onChange={(e) => setPassword(e.target.value)} placeholder="password..." name="password" value={password}></input>
              <button onClick={login}>Login</button>
            </form>
          </div>}
          {/* REGISTER */}
          {(authView === 'register') && <div className="register-container">
            <form className="input-main">
              <input onChange={(e) => setRegName(e.target.value)} placeholder="name..." name="name" value={regName}></input>
              <input onChange={(e) => setRegEmail(e.target.value)} placeholder="email..." name="email" value={regEmail}></input>
              <input onChange={(e) => setRegPassword(e.target.value)} placeholder="password..." name="password" value={regPassword}></input>
              <button onClick={register}>Register</button>
            </form>
          </div>}
        </div>}
        {(authView === 'loggedIn') && <div className="loggedIn-container">
          <p>Successfully logged in.</p>
        </div>}
        {(authView === 'registered') && <div className="registered-container">
          <p>Successfully registered.<br/>Please log in.</p>
        </div>}
      </div>
      
      {/* CONTENT */}
      <div className="content-container">
        <div className="heading">
          <h1>Task List</h1>
          <p>Welcome {('name' in userData) ? capitalizeFirstLetter(userData.name) : 'Guest. Please login or register.'}</p>
        </div>
        {('taskList' in userData) && <div className="content">
          <form className="add-task-main">
            <input onChange={(e) => setTaskTitle(e.target.value)} placeholder="task..." name="task" value={taskTitle}></input>
            <input onChange={(e) => setTaskDesc(e.target.value)} placeholder="desc..." name="desc" value={taskDesc}></input>
            <button onClick={(e, ) => addTask(e, userData._id)} className="button">Add task</button>
          </form>
          <div className="task-container">
            {userData.taskList.map(task =>
              <div className="task">
                <h3>{task.taskTitle}</h3>
                <p>{task.taskDesc}</p>
                <button onClick={() => removeTask(userData._id, task.id)}>Remove</button>
              </div>
            )}
          </div>
        </div>}
        {/* <button onClick={toggleView}>View data</button> */}
      </div>
    </div>
  );
}

export default App;
