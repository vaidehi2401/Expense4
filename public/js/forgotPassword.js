const resetBtn = document.getElementById("resetPassword");
const email = document.getElementById("email");
const password = document.getElementById("password");
const resetId = document.getElementById("resetId");
resetBtn.addEventListener("click", async (event) => {
    event.preventDefault();
    console.log("called");
    const emailValue = email.value.trim();
    const passwordValue = password.value.trim();
    const resetIdValue = resetId.value.trim();
console.log(resetIdValue)
    try {
        const response = await axios.post("http://localhost:3003/password/setPassword", {
            email: emailValue,
            newPassword: passwordValue, // Use a clear key name for password
            resetId: resetIdValue
        });

        console.log(response);
        alert(response.data.message); // Notify the user
        window.location.href = "/signup"; // Redirect after password reset
    } catch (err) {
        console.error("Error resetting password:", err.response?.data || err.message);
        alert("Error resetting password. Please try again.");
    }
});
