// src/utils/peer.js
import Peer from 'peerjs';

const peer = new Peer(undefined, {
    host: 'localhost',
    port: 9000,
    path: '/'
});

export default peer;
