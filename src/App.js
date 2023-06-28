import React, { useState, useEffect } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/database';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';

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

    useEffect(() => {
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                setUser(user);
                fetchTasks(user.uid);
            } else {
                setUser(null);
                setTasks([]);
            }
        });
    }, []);

    const signIn = (name) => {
        firebase
            .auth()
            .signInAnonymously()
            .then((response) => {
                const user = response.user;
                user
                    .updateProfile({ displayName: name })
                    .then(() => {
                        setUser(user);
                        fetchTasks(user.uid);
                    })
                    .catch((error) => {
                        console.error('Error updating profile:', error);
                    });
            })
            .catch((error) => {
                console.error('Error signing in:', error);
            });
    };

    const signOut = () => {
        firebase
            .auth()
            .signOut()
            .then(() => {
                setUser(null);
                setTasks([]);
            })
            .catch((error) => {
                console.error('Error signing out:', error);
            });
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
        const userTasksRef = firebase.database().ref(`tasks/${user.uid}`);
        const newTaskRef = userTasksRef.push();
        const newTask = { id: newTaskRef.key, ...task };
        newTaskRef
            .set(newTask)
            .then(() => {
                setTasks([...tasks, newTask]);
            })
            .catch((error) => {
                console.error('Error adding task:', error);
            });
    };

    const deleteTask = (id) => {
        firebase
            .database()
            .ref(`tasks/${user.uid}/${id}`)
            .remove()
            .then(() => {
                setTasks(tasks.filter((task) => task.id !== id));
            })
            .catch((error) => {
                console.error('Error deleting task:', error);
            });
    };

    const toggleTask = (id) => {
        const updatedTasks = tasks.map((task) =>
            task.id === id ? { ...task, status: !task.status } : task
        );
        setTasks(updatedTasks);
        firebase
            .database()
            .ref(`tasks/${user.uid}/${id}`)
            .update({ status: updatedTasks.find((task) => task.id === id).status })
            .catch((error) => {
                console.error('Error updating task:', error);
            });
    };

    return (
        <div className="App">
            <header>
                {user ? (
                    <>
                        <p>Welcome, {user.displayName}!</p>
                        <button className="btn" onClick={signOut}>
                            Sign Out
                        </button>
                    </>
                ) : (
                    <div>
                        <h2>Sign In</h2>
                        <input type="text" id="nameInput" placeholder="Enter your name" />
                        <button className="btn" onClick={() => signIn(document.getElementById('nameInput').value)}>
                            Sign In
                        </button>
                    </div>
                )}
            </header>
            {user ? (
                <>
                    <TaskForm onAdd={addTask} />
                    {tasks.length > 0 ? (
                        <TaskList tasks={tasks} onDelete={deleteTask} onToggle={toggleTask} />
                    ) : (
                        <p>No tasks available.</p>
                    )}
                </>
            ) : (
                <p>Please sign in to view your tasks.</p>
            )}
        </div>
    );
};

export default App;
