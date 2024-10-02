// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";
import { getDatabase, ref, set, onValue } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-database.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-analytics.js";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBv_IH3o2ok2w_hzIT2OW90xxbEK7quLE0",
  authDomain: "dodleshahan.firebaseapp.com",
  projectId: "dodleshahan",
  storageBucket: "dodleshahan.appspot.com",
  messagingSenderId: "888863093800",
  appId: "1:888863093800:web:b5c3b194df30197cbfb11d",
  measurementId: "G-N2GMLPEGMD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const database = getDatabase(app);

// Canvas setup
const canvas = document.getElementById('drawingCanvas');
const ctx = canvas.getContext('2d');
let drawing = false;
let currentPosition = { x: 0, y: 0 };

// Start drawing
canvas.addEventListener('mousedown', (e) => {
  drawing = true;
  currentPosition = { x: e.offsetX, y: e.offsetY };
});

// Draw on canvas
canvas.addEventListener('mousemove', (e) => {
  if (!drawing) return;
  
  const newPosition = { x: e.offsetX, y: e.offsetY };
  drawLine(currentPosition.x, currentPosition.y, newPosition.x, newPosition.y);

  // Save drawing data to Firebase
  saveDrawingData(currentPosition.x, currentPosition.y, newPosition.x, newPosition.y);
  
  currentPosition = newPosition;
});

// Stop drawing
canvas.addEventListener('mouseup', () => {
  drawing = false;
});

// Clear canvas
document.getElementById('clear').addEventListener('click', () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  set(ref(database, 'drawing'), null); // Clears the Firebase data
});

// Draw a line on the canvas
function drawLine(x1, y1, x2, y2) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.closePath();
}

// Save drawing data to Firebase
function saveDrawingData(x1, y1, x2, y2) {
  const drawingRef = ref(database, 'drawing');
  const drawingData = { x1, y1, x2, y2 };
  set(drawingRef, drawingData);
}

// Retrieve and draw from Firebase in real-time
const drawingRef = ref(database, 'drawing');
onValue(drawingRef, (snapshot) => {
  const data = snapshot.val();
  if (data) {
    drawLine(data.x1, data.y1, data.x2, data.y2);
  }
});
