import React, { useState, useEffect } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/database';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import './App.css';

const firebaseConfig = {
    // Paste your Firebase config object here
    apiKey: "AIzaSyCHAaa-dMj9t7kjXUulk3fRx5hDw2fPPu0",
    authDomain: "tasktracker-44e6e.firebaseapp.com",
    databaseURL: "https://tasktracker-44e6e-default-rtdb.firebaseio.com",
    projectId: "tasktracker-44e6e",
    storageBucket: "tasktracker-44e6e.appspot.com",
    messagingSenderId: "584345181678",
    appId: "1:584345181678:web:d23845b09785080cfe02ff",
    measurementId: "G-SM988P8VKP"
};

firebase.initializeApp(firebaseConfig);

const App = () => {
    const [user, setUser] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [nameInput, setNameInput] = useState('');
    const [showModal, setShowModal] = useState(true);
    const [editTask, setEditTask] = useState(null);

    useEffect(() => {
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                setUser(user);
                setShowModal(false);
                fetchTasks(user.uid);
            } else {
                setUser(null);
                setTasks([]);
                setShowModal(true);
                // Clear the tasks when signing out
                firebase.database().ref('tasks').off();
            }
        });
    }, []);

    const signOut = () => {
        firebase
            .auth()
            .signOut()
            .catch((error) => {
                console.error('Error signing out:', error);
            });
    };

    const handleNameSubmit = (event) => {
        event.preventDefault();
        const name = nameInput.trim();
        if (name !== '') {
            firebase
                .auth()
                .signInAnonymously()
                .then((userCredential) => {
                    const user = userCredential.user;
                    setUser(user);
                    setShowModal(false);
                    setNameInput('');
                    user.updateProfile({
                        displayName: name, // Save the user's name
                    }).then(() => {
                        // Name updated successfully
                    }).catch((error) => {
                        console.error('Error updating display name:', error);
                    });
                })
                .catch((error) => {
                    console.error('Error signing in:', error);
                });
        }
    };

    const fetchTasks = (userId) => {
        firebase
            .database()
            .ref(`tasks/${userId}`)
            .on('value', (snapshot) => {
                const data = snapshot.val();
                if (data) {
                    const tasks = Object.keys(data).map((key) => ({
                        id: key,
                        ...data[key],
                    }));
                    setTasks(tasks);
                } else {
                    setTasks([]);
                }
            });
    };

    const addTask = (task) => {
        if (user) {
            const userTasksRef = firebase.database().ref(`tasks/${user.uid}`);
            const newTaskRef = userTasksRef.push();
            const newTask = { id: newTaskRef.key, ...task };
            newTaskRef
                .set(newTask)
                .then(() => {
                    // Task added successfully
                })
                .catch((error) => {
                    console.error('Error adding task:', error);
                });
        }
    };

    const deleteTask = (id) => {
        if (user) {
            const taskRef = firebase.database().ref(`tasks/${user.uid}/${id}`);
            const confirmDelete = window.confirm('Are you sure you want to delete this task?');
            if (confirmDelete) {
                taskRef
                    .remove()
                    .then(() => {
                        // Task deleted successfully
                    })
                    .catch((error) => {
                        console.error('Error deleting task:', error);
                    });
            }
        }
    };

    const toggleTask = (id, status) => {
        const updatedStatus = !status;
        const taskRef = firebase.database().ref(`tasks/${user.uid}/${id}`);
        taskRef
            .update({ status: updatedStatus })
            .then(() => {
                // Task status updated successfully
            })
            .catch((error) => {
                console.error('Error updating task status:', error);
            });
    };

    const editTaskHandler = (task) => {
        setEditTask(task);
    };

    const updateTask = (id, updatedTask) => {
        const taskRef = firebase.database().ref(`tasks/${user.uid}/${id}`);
        taskRef
            .update(updatedTask)
            .then(() => {
                setEditTask(null);
            })
            .catch((error) => {
                console.error('Error updating task:', error);
            });
    };

    return (
        <div className="task-tracker">
            <header>
                {user ? (
                    <div className="user-info">
                        <p className="welcome-text">Welcome, {user.displayName || 'Guest'}!</p>
                        <button className="btn-signout" onClick={signOut}>
                            Sign Out
                        </button>
                    </div>
                ) : (
                    <form className="name-form" onSubmit={handleNameSubmit}>
                        <label htmlFor="nameInput" className="name-label">
                            Enter your name:
                        </label>
                        <div className="name-input">
                            <input
                                type="text"
                                id="nameInput"
                                placeholder="Your name"
                                value={nameInput}
                                onChange={(event) => setNameInput(event.target.value)}
                            />
                            <button type="submit" className="btn-signin">
                                Sign In
                            </button>
                        </div>
                    </form>
                )}
            </header>
            {user ? (
                <div className="content">
                    <TaskForm onAdd={addTask} editTask={editTask} onUpdate={updateTask} />
                    {tasks.length > 0 ? (
                        <TaskList tasks={tasks} onDelete={deleteTask} onToggle={toggleTask} onEdit={editTaskHandler} />
                    ) : (
                        <p className="no-tasks">No tasks available.</p>
                    )}
                </div>
            ) : (
                showModal && <p className="no-tasks">Please sign in to view your tasks.</p>
            )}
        </div>
    );
};

export default App;
