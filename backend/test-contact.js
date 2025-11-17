// Test script to POST contact to the backend
fetch("http://localhost:5000/api/contact", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    name: "Test User",
    email: "test@example.com",
    mobile: "9876543210",
    message: "This is a test message to verify MongoDB save."
  })
})
  .then(res => res.json())
  .then(data => console.log("Response:", JSON.stringify(data, null, 2)))
  .catch(err => console.error("Error:", err));
