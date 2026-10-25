const user = JSON.parse(localStorage.getItem("user"));

if(!user){

    window.location.href="login.html";

}

// Welcome

document.getElementById("welcomeUser").innerHTML =
`👋 ${user.name}`;

// Current Date

const options = {

    weekday:"long",
    year:"numeric",
    month:"long",
    day:"numeric"

};

document.getElementById("currentDate").innerHTML =
new Date().toLocaleDateString("en-IN",options);

// Logout

document.getElementById("logoutBtn").addEventListener("click",()=>{

    if(confirm("Do you really want to Logout?")){

        localStorage.removeItem("token");

        localStorage.removeItem("user");

        window.location.href="login.html";

    }

});