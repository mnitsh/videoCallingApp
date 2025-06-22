import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

function Room() {
  const { roomId } = useParams();

  useEffect(() => {
    socket.emit("join-room", roomId);

    socket.on("user-joined", (id) => {
      console.log("User joined:", id);
    });

    return () => {
      socket.disconnect();
    };
  }, [roomId]);

  return (
    <div className="flex items-center justify-center h-screen text-xl">
      Room: {roomId}
    </div>
  );
}

export default Room;
