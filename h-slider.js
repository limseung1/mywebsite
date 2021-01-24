
// Pick up slide triggers and contents
h_slide_triggers = document.querySelectorAll(".slide");
h_slide_contents = document.querySelectorAll(".skill");

h_slide_triggers.forEach((slide, idx)=>{
    slide.addEventListener("click", function(){

        // Slide Button Click Effect
        h_slide_triggers.forEach((slide)=>{
            slide.style["box-shadow"] = "none"
        });

        slide.style["box-shadow"]="0px 0px 4px 0px white"

        // Hide all slide contents
        h_slide_contents.forEach((content) => {
            content.classList.add("d-none");
            content.classList.add("d-sm-block");
            
        })


        // Remove display animation
        h_slide_contents.forEach((content) =>{
            content.classList.remove("skill-animation")
        })

        // Display Specific slide content
        h_slide_contents[idx].classList.remove("d-none")
        h_slide_contents[idx].classList.remove("d-sm-block")
        h_slide_contents[idx].classList.add("skill-animation")
    })
})
