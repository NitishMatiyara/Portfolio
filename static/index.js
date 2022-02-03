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
const drop = document.querySelector(".slide")
togle.addEventListener("click", ()=>{
   drop.classList.toggle("active")
   
})
