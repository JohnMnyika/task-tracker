import React from 'react';

const Task = ({ task, onDelete, onToggle }) => {
    const { id, title, description, status, dueDate } = task;

    return (
        <div className={`task ${status ? 'completed' : ''}`}>
            <h3>{title}</h3>
            <p>{description}</p>
            <p>{dueDate}</p>
            <button className="btn btn-delete" onClick={() => onDelete(id)}>
                Delete
            </button>
            <button className="btn btn-toggle" onClick={() => onToggle(id)}>
                {status ? 'Reopen' : 'Complete'}
            </button>
        </div>
    );
};

export default Task;
