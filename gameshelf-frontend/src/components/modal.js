import React, { useState } from 'react';
import '../App.css';

const Modal = ({ game, onClose, onSave }) => {
  const [platform, setPlatform] = useState(game.platform);
  const [status, setStatus] = useState(game.status);

  const handleSave = () => {
    onSave({ platform, status });
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>Edit Game</h3>
        <div className="modal-content">
          <label>
            Game Name:
              <p id="gamename">{game.title}</p>
          </label>
          <label>
            Platform: 
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
            >
              <option value="Steam">Steam</option>
              <option value="Epic Games">Epic Games</option>
              <option value="Other">Other</option>
            </select>
          </label>
          <br/>
          <label>
            Status: 
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="Planning To Play">Planning To Play</option>
              <option value="Playing">Playing</option>
              <option value="Completed">Completed</option>
            </select>
          </label>
        </div>
        <button onClick={handleSave}>Save</button>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default Modal;