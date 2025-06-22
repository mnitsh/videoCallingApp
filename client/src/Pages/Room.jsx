// src/pages/Room.jsx
import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import socket from "../utils/socket";
import peer from "../utils/peer";

const Room = () => {
  const { roomId } = useParams();
  const localVideoRef = useRef(null);
  const [myPeerId, setMyPeerId] = useState("");
  const [streamRef, setStreamRef] = useState(null);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCamOn, setIsCamOn] = useState(true);

  const toggleMic = () => {
    if (streamRef) {
      streamRef.getAudioTracks().forEach((track) => {
        track.enabled = !track.enabled;
        setIsMicOn(track.enabled);
      });
    }
  };

  const toggleCamera = () => {
    if (streamRef) {
      streamRef.getVideoTracks().forEach((track) => {
        track.enabled = !track.enabled;
        setIsCamOn(track.enabled);
      });
    }
  };

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({
        video: true,
        audio: true,
      })
      .then((stream) => {
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }

        setStreamRef(stream);

        peer.on("open", (id) => {
          setMyPeerId(id);
          socket.emit("join-room", roomId, id);
        });

        peer.on("call", (call) => {
          call.answer(stream);
          const video = document.createElement("video");
          call.on("stream", (userVideoStream) => {
            addVideoStream(video, userVideoStream);
          });
        });

        socket.on("user-joined", (userId) => {
          const call = peer.call(userId, stream);
          const video = document.createElement("video");
          call.on("stream", (userVideoStream) => {
            addVideoStream(video, userVideoStream);
          });
        });

        // ⬇️ Place it HERE (inside the same useEffect)
        function addVideoStream(video, stream) {
          video.srcObject = stream;
          video.playsInline = true;
          video.autoplay = true;
          video.className =
            "w-72 h-48 object-cover border-2 border-white rounded-lg shadow-lg bg-black";
          document.getElementById("video-grid").appendChild(video);
        }
      })
      .catch((err) => {
        console.error("🚨 Could not access camera/mic:", err);
        alert(
          "⚠️ Error accessing your camera/mic. Please check browser permissions."
        );
      });

    return () => {
      socket.disconnect();
      peer.destroy();
    };
  }, [roomId]);

  return (
    <div className="p-4 bg-gray-900 min-h-screen text-white">
      <h2 className="text-2xl font-semibold mb-2">Room: {roomId}</h2>
      <p className="mb-4">Your Peer ID: {myPeerId}</p>

      <div
        id="video-grid"
        className="flex flex-wrap justify-center items-start gap-4"
      >
        <video
          ref={localVideoRef}
          muted
          autoPlay
          playsInline
          className="w-72 h-48 object-cover border-2 border-white rounded-lg shadow-lg bg-black"
        ></video>
      </div>

      <div className="flex justify-center gap-4 my-4">
        <button
          onClick={toggleMic}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
        >
          {isMicOn ? "Mute Mic" : "Unmute Mic"}
        </button>
        <button
          onClick={toggleCamera}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
        >
          {isCamOn ? "Turn Off Camera" : "Turn On Camera"}
        </button>
      </div>
    </div>
  );
};

export default Room;
