const tabItems = document.querySelectorAll(".sum");
const summaryContainer = document.querySelector(".show");


tabItems.forEach(item => {
    item.addEventListener("click", selectItems);
});

// MAIN FUNCTION
function selectItems() {
    document.querySelector(".appear-bar").style.transform = `scaleX(1)`;
    document.querySelector(".appear-bar").style.backgroundColor = `#0d77ce`;

    let scrollIncentive = 0;
    showSummary.call(this);

    // Clear selections
    for (let child of this.parentElement.children) {
        if (child.classList.contains("selected-bg")) {
            scrollIncentive++;
            if (child === this) {
                break;
            }
            // console.log("selected");
            child.classList.remove("selected-bg");
            child.firstElementChild.classList.remove("selected-text");
            child.lastElementChild.classList.remove("selected-text");
        }
    }

    // Scroller:
    if (scrollIncentive === 0) {
        // #selection ??
        smoothScroll(".navbar", 800);
    }

    // Determine Selection + slide operaion
    if (this.classList.contains("selected-bg")) {
        removeSelection.call(this);
        slideclose(summaryContainer);
    } else {
        addSelection.call(this);
        slideopen(summaryContainer);
    }
}

// Selection Functions
function removeSelection() {
    this.classList.remove("selected-bg");
    this.firstElementChild.classList.remove("selected-text");
    this.lastElementChild.classList.remove("selected-text");
}
function addSelection() {
    this.classList.add("selected-bg");
    this.firstElementChild.classList.add("selected-text");
    this.lastElementChild.classList.add("selected-text");


}

// Slider Functions
function slideopen(summaryContainer) {
    setBorder(0.15, "#0d77ce");
    summaryContainer.style.height = `70vh`;
}
function slideclose(summaryContainer) {
    setBorder(0.15, "var(--primary-color");
    summaryContainer.style.height = `0px`;
    document.querySelector(".appear-bar").style.backgroundColor = `var(--primary-color)`;
    document.querySelector(".appear-bar").style = null;

}

// Border Function:
function setBorder(borderWidth, color) {
    document.querySelector(
        "#selection .border-line"
    ).style.borderBottom = `${borderWidth}rem solid ${color}`;
    document.querySelector(
        "#selection .border-line"
    ).style.transition = `border-bottom 1s`;
    document.querySelector(
        ".show-selection .border-line"
    ).style.borderBottom = `${borderWidth}rem solid ${color}`;
}

// Show Summary Functions:
function showSummary() {
    const currContent = document.querySelector(`.select-${this.classList[1]}`);
    // Default all hidden
    for (let content of currContent.parentElement.children) {
        content.classList.replace("display", "hidden");
    }
    // Display current summary
    currContent.classList.replace("hidden", "display");
}

// Smooth Scroller Function:
function smoothScroll(target, duration) {
    var target = document.querySelector(target);
    var targetPos = target.getBoundingClientRect().top;
    var startPos = window.pageYOffset;
    var distance = targetPos;
    var startTime = null;

    function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        var timeElapsed = currentTime - startTime;
        var run = ease(timeElapsed, startPos, distance, duration);

        window.scrollTo(0, run);
        if (timeElapsed < duration) requestAnimationFrame(animation);
    }

    function ease(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return (c / 2) * t * t * t + b;
        t -= 2;
        return (c / 2) * (t * t * t + 2) + b;
    }

    requestAnimationFrame(animation);
}


// Carousel
let slide_count = 0;
const slide_items = document.getElementsByClassName('carousel-item')
const total_count = slide_items.length;

document.getElementById('carousel-prev').addEventListener("click", function() {
    move_to_prev_slide();
});

document.getElementById('carousel-next').addEventListener("click", function() {
    move_to_next_slide();
});

function move_to_prev_slide() {
    
    if (slide_count === 0) {
        slide_count = total_count - 1;
    } else {
        slide_count--;
    }
    update_slide();
    update_chart();
}
function move_to_next_slide() {
    if (slide_count === total_count - 1) {
        slide_count = 0;
    } else {
        slide_count++;
    }
    update_slide();
    update_chart()
};

function update_slide() {
    for (item of slide_items){
        item.classList.add('carousel-item-hide');
        item.classList.remove('carousel-item-visible')
    };

    slide_items[slide_count].classList.add('carousel-item-visible');
};




// Plot updated chart <- modify these

function update_chart() {
    if (slide_count === 0){
        update_header_sub_control(
            "Performance over Years",
            "Cumulative averages show sucessive grades over the entire academic years. Yearly averages show a grade received in a single academic year.",
            "Final Average: 77%",
            "cum-yearly"
            );
        plot_line_all();

    } else if (slide_count === 1) {
        update_header_sub_control(
            "Performance by Course",
            "The chart shows the final grades received in each course, and its description when hovered on each bin.",
            "",
            "college-years"
            );
        plot_bar_average();

    } else if (slide_count === 2) {
        update_header_sub_control(
            "Performance by Descipline",
            "The chart shows average grades received in seven disciplines of study.",
            "",
            ""
            );
        plot_radar();
    }
}



// Change Background

let bg = document.querySelector(".border-flash")

document.querySelector(".educ").addEventListener("click", e => {
    remove_bg_all()
    bg.classList.add("bg-educ")
})
document.querySelector(".exp").addEventListener("click", e => {
    remove_bg_all()
    bg.classList.add("bg-exp")
})
document.querySelector(".tech").addEventListener("click", e => {
    remove_bg_all()
    bg.classList.add("bg-tech")
})
document.querySelector(".certs").addEventListener("click", e => {
    remove_bg_all()
    bg.classList.add("bg-certs")
})

function remove_bg_all(){
    document.querySelector(".border-flash").classList.remove("bg-educ")
    document.querySelector(".border-flash").classList.remove("bg-exp")
    document.querySelector(".border-flash").classList.remove("bg-tech")
    document.querySelector(".border-flash").classList.remove("bg-certs")
}