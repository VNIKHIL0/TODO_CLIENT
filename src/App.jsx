import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './style.css';

const FILTERS = {
  ALL: 'All',
  ACTIVE: 'Active',
  COMPLETED: 'Completed',
};

function App() {
  const [tasks, setTasks] = useState([]);
  const [text, setText] = useState('');
  const [filter, setFilter] = useState(FILTERS.ALL);
  const [darkMode, setDarkMode] = useState(false);

  const API_BASE = 'https://todo-backend-69t0.onrender.com/tasks';

  useEffect(() => {
    document.body.className = darkMode ? 'dark-mode' : '';
  }, [darkMode]);

  // Fetch tasks from the server
  const fetchTasks = async () => {
    try {
      const res = await axios.get(API_BASE);
      setTasks(res.data);
    } catch (error) {
      console.error('Error fetching tasks:', error.message);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Add a new task
  const addTask = async () => {
    if (!text.trim()) return;
    try {
      await axios.post(API_BASE, {
        text,
        completed: false,
      });
      setText('');
      fetchTasks();
    } catch (error) {
      console.error('Error adding task:', error.message);
    }
  };

  // Toggle task completion
  const updateTask = async (task) => {
    try {
      await axios.put(`${API_BASE}/${task._id}`, {
        ...task,
        completed: !task.completed,
      });
      fetchTasks();
    } catch (error) {
      console.error('Error updating task:', error.message);
    }
  };

  // Delete task
  const deleteTask = async (id) => {
    try {
      await axios.delete(`${API_BASE}/${id}`);
      fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error.message);
    }
  };

  // Filter tasks
  const filteredTasks = tasks.filter((task) => {
    if (filter === FILTERS.ACTIVE) return !task.completed;
    if (filter === FILTERS.COMPLETED) return task.completed;
    return true;
  });

  return (
    <div className="container">
      <div style={{ textAlign: 'right' }}>
        <button onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? '🌞 Light Mode' : '🌙 Dark Mode'}
        </button>
      </div>

      <h1>📝 To-Do List</h1>

      <div>
        <input
          type="text"
          placeholder="Add task..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button onClick={addTask}>Add</button>
      </div>

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

export default App;
