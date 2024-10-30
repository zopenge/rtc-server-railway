const express = require('express');
const router = express.Router();
const WebSocket = require('ws');

// create WebSocket server
const wss = new WebSocket.Server({ noServer: true });

// store connected peers
const peers = new Map();

// handle websocket connection
function handleConnection(ws, peerId) {
    console.log(`Peer ${peerId} connected`);
    
    // store websocket connection
    peers.set(peerId, {
        ws,
        timestamp: Date.now()
    });

    // handle incoming messages
    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message);
            handleWebSocketMessage(peerId, data);
        } catch (error) {
            console.error('Failed to parse message:', error);
        }
    });

    // handle disconnection
    ws.on('close', () => {
        console.log(`Peer ${peerId} disconnected`);
        peers.delete(peerId);
    });
}

// handle websocket messages
function handleWebSocketMessage(fromPeerId, data) {
    const { type, payload } = data;
    
    // validate message
    if (!type) {
        return;
    }

    // create broadcast message
    const message = JSON.stringify({
        type,
        fromPeerId,
        payload
    });
    
    // broadcast to all peers except sender
    peers.forEach((peer, peerId) => {
        if (peerId !== fromPeerId && peer.ws.readyState === WebSocket.OPEN) {
            peer.ws.send(message);
        }
    });
}

// get list of available peers
router.get('/peers', (req, res) => {
    const peerList = Array.from(peers.keys());
    res.json({ peers: peerList });
});

// attach websocket upgrade handler to main server
function attachWebSocket(server) {
    server.on('upgrade', (request, socket, head) => {
        // extract peerId from URL
        const url = new URL(request.url, `http://${request.headers.host}`);
        const peerId = url.searchParams.get('peerId');

        if (!peerId) {
            socket.destroy();
            return;
        }

        wss.handleUpgrade(request, socket, head, (ws) => {
            handleConnection(ws, peerId);
        });
    });
}

module.exports = { router, attachWebSocket }; 