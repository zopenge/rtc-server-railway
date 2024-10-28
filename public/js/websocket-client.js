// determine websocket URL based on current location
const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
const wsUrl = `${wsProtocol}//${window.location.host}`;
const ws = new WebSocket(wsUrl);

ws.onopen = function() {
    console.log('Connected to server');
    // 可以添加一个连接状态指示
    document.body.style.backgroundColor = '#f0f8ff';
};

ws.onmessage = function(event) {
    console.log('Received:', event.data);
    const messagesDiv = document.getElementById('messages');
    const messageElement = document.createElement('div');
    messageElement.textContent = event.data;
    messagesDiv.appendChild(messageElement);
};

ws.onclose = function() {
    console.log('Disconnected from server');
    // 可以添加断开连接的视觉提示
    document.body.style.backgroundColor = '#ffe4e1';
};

ws.onerror = function(error) {
    console.error('WebSocket error:', error);
};
