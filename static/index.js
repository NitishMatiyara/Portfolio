const navBar = document.querySelector(".navbar")
const scrollUp = document.getElementById("scroll-up-btn")
window.addEventListener( "scroll", ()=>{
    
    if(window.scrollY > 20){
        navBar.classList.add("sticky")
          }
    else{
        navBar.classList.remove("sticky")
    }    

    if(window.scrollY > 500){
        scrollUp.classList.add("show")

    }
    else{
        scrollUp.classList.remove("show")
    }
})

// slide-up script
scrollUp.addEventListener("click", ()=>{
    window.scrollTo(0,0)
    
})

// Toggle menu/navbar
const togle = document.querySelector(".menu-btn")
const dropMenu = document.querySelector(".menu")
const drop = document.getElementById("slide")
togle.addEventListener("click", ()=>{
 dropMenu.classList.toggle("active")
   drop.classList.toggle("active")
})


//RegEx Form Validation

function validation(){

var username = document.getElementById('username').value
var email = document.getElementById('useremail').value
var mobile = document.getElementById('usermobile').value
var desc = document.getElementById('userdesc').value

var usercheck = /^[A-Za-z. ]{3,20}$/ ;
var emailcheck = /^[A-Za-z0-9_.]{3,}@[A-Za-z]{5,}[.]{1}[A-Za-z.]{2,6}$/;
var mobilecheck = /^[789][0-9]{9}$/;
var desccheck = /^[A-Za-z0-9. ]{5,30}$/;

if(usercheck.test(username)){
document.getElementById('errorname').innerHTML="";
}else {
  document.getElementById('errorname').innerHTML="* Username Invalid";
  return false  
}

if(emailcheck.test(email)){
  document.getElementById('erroremail').innerHTML="";
}else {
  document.getElementById('erroremail').innerHTML="* Email is Invalid";
  return false  
}

if(mobilecheck.test(mobile)){
  document.getElementById('errormobile').innerHTML="";
}else {
  document.getElementById('errormobile').innerHTML="* Mobile Number is Invalid";
  return false  
}

if(desccheck.test(desc)){
  document.getElementById('errordesc').innerHTML="";
}else {
  document.getElementById('errordesc').innerHTML="* Description between 5-30 characters";
  return false  
}


}