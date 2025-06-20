import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import '../style.css';

const FILTERS = {
  ALL: 'All',
  ACTIVE: 'Active',
  COMPLETED: 'Completed',
};

function Home() {
  const [tasks, setTasks] = useState([]);
  const [text, setText] = useState('');
  const [filter, setFilter] = useState(FILTERS.ALL);
  const [darkMode, setDarkMode] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const navigate = useNavigate();

  const API_BASE = 'https://todo-backend-69t0.onrender.com/tasks';

  // Set dark mode class
  useEffect(() => {
    document.body.className = darkMode ? 'dark-mode' : '';
  }, [darkMode]);

  // On load: check token
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    } else {
      setLoggedIn(true);
      fetchTasks();
    }
  }, []);

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(API_BASE, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(res.data);
    } catch (error) {
      console.error('Error fetching tasks:', error.message);
    }
  };

  const addTask = async () => {
    if (!text.trim()) return;
    try {
      const token = localStorage.getItem('token');
      await axios.post(API_BASE, { text, completed: false }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setText('');
      fetchTasks();
    } catch (error) {
      console.error('Error adding task:', error.message);
    }
  };

  const updateTask = async (task) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_BASE}/${task._id}`, {
        ...task,
        completed: !task.completed,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchTasks();
    } catch (error) {
      console.error('Error updating task:', error.message);
    }
  };

  const deleteTask = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_BASE}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error.message);
    }
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === FILTERS.ACTIVE) return !task.completed;
    if (filter === FILTERS.COMPLETED) return task.completed;
    return true;
  });

  return (
    <div className="container">
      {/* Navigation Buttons */}
      <div style={{ marginBottom: '20px' }}>
        {!loggedIn && (
          <>
            <Link to="/signup"><button>Signup</button></Link>
            <Link to="/login" style={{ marginLeft: '10px' }}><button>Login</button></Link>
          </>
        )}
      </div>

      {/* Dark mode and logout */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
       {/* Left-aligned: Dark mode toggle */}
        <button onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? '🌞 Light Mode' : '🌙 Dark Mode'}
        </button>

        {/* Right-aligned: Logout */}
          {loggedIn && (
            <button onClick={() => {
              localStorage.removeItem('token');
              setLoggedIn(false);
              navigate('/login');
            }}>
              Logout
            </button>
            )}
        </div>


      {/* Header */}
      <h1>📝 To-Do List</h1>

      {/* Add task */}
      <div>
        <input
          type="text"
          placeholder="Add task..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button onClick={addTask}>Add</button>
      </div>

      {/* Filters */}
      <div className="filter-buttons">
        {Object.values(FILTERS).map((f) => (
          <button
            key={f}
            className={f === filter ? 'active' : ''}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Task List */}
      <ul>
        {filteredTasks.map((task) => (
          <li key={task._id} className={task.completed ? 'completed' : ''}>
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => updateTask(task)}
            />
            {task.text}
            <button onClick={() => deleteTask(task._id)}>❌</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Home;
