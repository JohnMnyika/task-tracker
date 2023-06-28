import React, { useState } from 'react';

const TaskForm = ({ onAdd }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!title || !dueDate) {
            alert('Please provide a title and due date for the task.');
            return;
        }

        const newTask = {
            title,
            description,
            status: false,
            dueDate,
        };

        onAdd(newTask);

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
                    onChange={(e) => setTitle(e.target.value)}
                />
            </div>
            <div className="form-control">
                <label htmlFor="description">Description</label>
                <textarea
                    id="description"
                    placeholder="Enter task description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                ></textarea>
            </div>
            <div className="form-control">
                <label htmlFor="dueDate">Due Date</label>
                <input
                    type="date"
                    id="dueDate"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                />
            </div>
            <button type="submit" className="btn btn-add">
                Add Task
            </button>
        </form>
    );
};

export default TaskForm;
