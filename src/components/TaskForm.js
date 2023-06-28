import React, { useState, useEffect } from 'react';

const TaskForm = ({ onAdd, editTask, onUpdate }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState('');

    useEffect(() => {
        if (editTask) {
            setTitle(editTask.title);
            setDescription(editTask.description);
            setDueDate(editTask.dueDate);
        } else {
            setTitle('');
            setDescription('');
            setDueDate('');
        }
    }, [editTask]);

    const handleSubmit = (event) => {
        event.preventDefault();

        if (!title || !dueDate) {
            alert('Please provide a title and due date for the task.');
            return;
        }

        const task = {
            title,
            description,
            dueDate,
        };

        if (editTask) {
            onUpdate(editTask.id, task);
        } else {
            onAdd(task);
        }

        setTitle('');
        setDescription('');
        setDueDate('');
    };

    return (
        <form className="task-form" onSubmit={handleSubmit}>
            <div className="form-control">
                <label htmlFor="title">Title</label>
                <input
                    type="text"
                    id="title"
                    placeholder="Enter task title"
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                />
            </div>
            <div className="form-control">
                <label htmlFor="description">Description</label>
                <textarea
                    id="description"
                    placeholder="Enter task description"
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                ></textarea>
            </div>
            <div className="form-control">
                <label htmlFor="dueDate">Due Date</label>
                <input
                    type="date"
                    id="dueDate"
                    value={dueDate}
                    onChange={(event) => setDueDate(event.target.value)}
                />
            </div>
            <button type="submit" className="btn btn-add">
                {editTask ? 'Update Task' : 'Add Task'}
            </button>
        </form>
    );
};

export default TaskForm;
