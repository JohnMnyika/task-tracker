import React from 'react';

const Task = ({ task, onDelete, onToggle, onEdit }) => {
    const { id, title, description, status, dueDate } = task;

    const handleEdit = () => {
        onEdit(task);
    };

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
            <button className="btn btn-edit" onClick={handleEdit}>
                Edit
            </button>
        </div>
    );
};

export default Task;
