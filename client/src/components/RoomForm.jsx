
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const RoomForm = () => {
  const [roomId, setRoomId] = useState('');
  const navigate = useNavigate();

  const generateRoomId = () => {
    return Math.random().toString(36).substring(2, 10);
  };

  const handleJoin = () => {
    const id = roomId.trim() || generateRoomId();
    navigate(`/room/${id}`);
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Enter Room ID (or leave blank to create)"
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
      />
      <button onClick={handleJoin}>Join/Create Room</button>
    </div>
  );
};

export default RoomForm;
