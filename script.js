// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-analytics.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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

// Canvas setup
const canvas = document.getElementById('drawingCanvas');
const ctx = canvas.getContext('2d');
let drawing = false;

// Function to start drawing
function startDrawing(e) {
    drawing = true;
    draw(e);
}

// Function to end drawing
function endDrawing() {
    drawing = false;
    ctx.beginPath();  // Stops the current path
}

// Function to draw on canvas
function draw(e) {
    if (!drawing) return;

    const x = e.clientX - canvas.offsetLeft;
    const y = e.clientY - canvas.offsetTop;

    ctx.lineWidth = 5;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#000000";

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);

    // Send the drawing coordinates to Firebase
    const drawData = { x, y };
    const drawRef = ref(database, 'drawings');
    set(drawRef.push(), drawData);  // Push the new point to the database
}

// Function to render the drawing from Firebase data
function renderDrawing(snapshot) {
    const data = snapshot.val();
    if (!data) return;
    
    // Draw each point from the database
    ctx.lineTo(data.x, data.y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(data.x, data.y);
}

// Event listeners for drawing on canvas
canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mouseup', endDrawing);
canvas.addEventListener('mousemove', draw);

// Firebase listener for real-time drawing sync
const drawRef = ref(database, 'drawings');
onValue(drawRef, (snapshot) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);  // Clear the canvas
    snapshot.forEach(childSnapshot => {
        renderDrawing(childSnapshot);  // Draw based on data from Firebase
    });
});

// Clear canvas and remove data from Firebase
const clearButton = document.getElementById('clear');
clearButton.addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const drawRef = ref(database, 'drawings');
    remove(drawRef);  // Clear the drawings from the database
});
