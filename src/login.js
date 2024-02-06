function login(username, password) {
  // Insecure way of handling credentials (plaintext)
  if (username === "admin" && password === "password123") {
    // Insecure way of handling authentication (client-side only)
    localStorage.setItem("isLoggedIn", "true");
    alert("Login successful!");
    // Insecure way of redirecting to a dashboard page
    window.location.href = "dashboard.html";
  } else {
    alert("Invalid username or password.");
  }
}
