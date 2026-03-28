let gettext = document.querySelector(".meratext")

gettext.addEventListener("click",()=>{
    gettext.classList.toggle("truncate");
    let h1 = gettext.closest("h1").classList.toggle("w-auto")
})


