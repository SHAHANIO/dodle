// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";
import { getDatabase, ref, push, onChildAdded, set, remove } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-database.js";
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
let brushSize = document.getElementById('brushSize').value;
let brushColor = document.getElementById('brushColor').value;

// Update brush size and color based on user input
document.getElementById('brushSize').addEventListener('input', (e) => {
    brushSize = e.target.value;
});

document.getElementById('brushColor').addEventListener('input', (e) => {
    brushColor = e.target.value;
});

// Start drawing
canvas.addEventListener('mousedown', (e) => {
  drawing = true;
  currentPosition = { x: e.offsetX, y: e.offsetY };
});

// Draw on canvas
canvas.addEventListener('mousemove', (e) => {
  if (!drawing) return;

  const newPosition = { x: e.offsetX, y: e.offsetY };
  drawLine(currentPosition.x, currentPosition.y, newPosition.x, newPosition.y, brushSize, brushColor);

  // Save each drawing action to Firebase
  saveDrawingData(currentPosition.x, currentPosition.y, newPosition.x, newPosition.y, brushSize, brushColor);
  
  currentPosition = newPosition;
});

// Stop drawing
canvas.addEventListener('mouseup', () => {
  drawing = false;
});

// Clear canvas and Firebase data
document.getElementById('clear').addEventListener('click', () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  remove(ref(database, 'drawing')); // Clears the Firebase data
});

// Draw a line on the canvas
function drawLine(x1, y1, x2, y2, size, color) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, x2);
  ctx.strokeStyle = color;
  ctx.lineWidth = size;
  ctx.stroke();
  ctx.closePath();
}

// Save each drawing stroke to Firebase with brush size and color
function saveDrawingData(x1, y1, x2, y2, size, color) {
  const drawingRef = ref(database, 'drawing');
  const newDrawingRef = push(drawingRef);  // Create a new unique reference for each stroke
  set(newDrawingRef, { x1, y1, x2, y2, size, color });
}

// Retrieve and draw from Firebase in real-time
const drawingRef = ref(database, 'drawing');
onChildAdded(drawingRef, (snapshot) => {
  const data = snapshot.val();
  drawLine(data.x1, data.y1, data.x2, data.y2, data.size, data.color);
});
