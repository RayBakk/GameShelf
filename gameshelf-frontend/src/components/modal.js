import React, { useState } from 'react';
import '../App.css';

const Modal = ({ game, onClose, onStatusChange, onNameChange }) => {
  const [newName, setNewName] = useState(game.name);

  const handleStatusChange = (newStatus) => {
    onStatusChange(game.id, newStatus);
    onClose();
  };

  const handleNameChange = () => {
    onNameChange(game.id, newName);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>Edit {game.name}</h3>
        <div className="modal-content">
          <label>
            Game Name:
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
          </label>
          <button onClick={handleNameChange}>Save Name</button>
        </div>
        <div className="status-options">
          <h4>Change Status:</h4>
          <button onClick={() => handleStatusChange('Planning to Play')}>
            Planning to Play
          </button>
          <button onClick={() => handleStatusChange('In Progress')}>
            In Progress
          </button>
          <button onClick={() => handleStatusChange('Completed')}>
            Completed
          </button>
        </div>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default Modal;