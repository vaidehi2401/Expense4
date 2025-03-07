const toggleForm = document.getElementById('toggle-form');
const formTitle = document.getElementById('form-title');
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const signUpButton = document.getElementById('signup-btn');
const loginButton = document.getElementById('login-btn');
const forgotPasswordLink = document.getElementById('forgot-password-link');
const forgotPasswordPopup = document.getElementById('forgot-password-popup');
const forgotSubmitbtn = document.getElementById("reset-password-btn")
const forgotEmail = document.getElementById("forgot-email")
toggleForm.addEventListener('click', () => {
    if (loginForm.style.display === 'none') {
        loginForm.style.display = 'block';
        signupForm.style.display = 'none';
        formTitle.textContent = 'Login';
        toggleForm.textContent = "Don't have an account? Sign up";
    } else {
        loginForm.style.display = 'none';
        signupForm.style.display = 'block';
        formTitle.textContent = 'Sign Up';
        toggleForm.textContent = "Already have an account? Login";
    }
});

signUpButton.addEventListener('click', async (event) => {
    event.preventDefault(); // Prevent form from submitting
    console.log("signup");

    const name = document.getElementById("signup-name").value.trim();
    const email = document.getElementById("signup-email").value.trim();
    const password = document.getElementById("signup-password").value.trim();

    if (name === "" || email === "" || password === "") {
        alert("Enter all fields");
        return;
    }

    const user = { name, email, password };

    try {
        const response = await axios.post("http://localhost:3003/users/signup", { user });
        console.log("Signup successful", response.data);
     localStorage.setItem('token', response.data.token);
     window.location.href="/homepage"    
    } catch (error) {
        alert("Email ID already registered!");
    }
});
loginButton.addEventListener('click', async(event)=>{
    event.preventDefault();
    const email = document.getElementById("login-email").value.trim();
    const password = document.getElementById("login-password").value.trim();
    if(email=="" || password==""){
        alert("⚠️ All fields are required!");
        return;
    }
    const user ={email, password};
    
    try {
        const response = await axios.post("http://localhost:3003/users/login", { user });
        console.log("Login successful", response.data);
        localStorage.setItem('token', response.data.token);
       window.location.href="/homepage"
       
    } catch (error) {
        const status = error.response.status;
        const message = error.response.data.error; 
        if (status === 400) {
            alert("⚠️ All fields are required!");
        } else if (status === 404) {
            alert("❌ User not found! Please register first.");
        } else if (status === 401) {
            alert("🔑 Invalid password! Please try again.");
        } else {
            alert("⚠️ Something went wrong: " + message);
        }
    }

})
forgotPasswordLink.addEventListener('click', () => {
    forgotPasswordPopup.style.display = 'block';
});

forgotSubmitbtn.addEventListener('click', async(event)=>{
    event.preventDefault();
   const forgotEmailvalue = forgotEmail.value.trim();
   if(forgotEmailvalue===""){
    alert("Enter your email first!")
    return;
   }
  try{
   const response = await axios.post(`http://localhost:3003/password/forgotpassword `,
    {
        email: forgotEmailvalue 
    }
   )
   console.log(response)
   forgotEmail.value="";
}
catch(err){
console.log(err)
}
})
document.addEventListener('click', (event) => {
    if (!forgotPasswordPopup.contains(event.target) && event.target !== forgotPasswordLink) {
        forgotPasswordPopup.style.display = 'none';
    }
});
