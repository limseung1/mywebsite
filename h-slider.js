
// Pick up slide triggers and contents
h_slide_triggers = document.querySelectorAll(".slide");
h_slide_contents = document.querySelectorAll(".skill");

h_slide_triggers.forEach((slide, idx)=>{
    slide.addEventListener("click", function(){

        // Hide all slide contents
        h_slide_contents.forEach((content) => {
            content.classList.add("d-none");
            content.classList.add("d-sm-block");
        })

        // Display Specific slide content
        h_slide_contents[idx].classList.remove("d-none")
        h_slide_contents[idx].classList.remove("d-sm-block")
    })
})
