import React from 'react';

const TaskList = ({ tasks, onDelete, onToggle, onEdit }) => {
    return (
        <div className="task-list">
            {tasks.map((task) => (
                <div
                    className={`task ${task.status ? 'completed' : ''}`}
                    key={task.id}
                >
                    <div className="task-info">
                        <h3>{task.title}</h3>
                        <p>{task.description}</p>
                        <p>Due Date: {task.dueDate}</p>
                    </div>
                    <div className="task-actions">
                        <button
                            className="toggle-btn"
                            onClick={() => onToggle(task.id, task.status)}
                        >
                            {task.status ? 'Mark Incomplete' : 'Mark Complete'}
                        </button>
                        <button
                            className="edit-btn"
                            onClick={() => onEdit(task)}
                        >
                            Edit
                        </button>
                        <button
                            className="delete-btn"
                            onClick={() => onDelete(task.id)}
                        >
                            Delete
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default TaskList;
