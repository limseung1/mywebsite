// Carousel
let slider_count = 0;
const slider_items = document.getElementsByClassName('slider-item');
const slider_navs = document.getElementsByClassName('slide-nav');
const slide_counter = slider_items.length;

document.getElementById('slide-prev').addEventListener("click", function() {
    move_to_prev();
});

document.getElementById('slide-next').addEventListener("click", function() {
    move_to_next();
});

function move_to_prev() {
    
    if (slider_count === 0) {
        slider_count = slide_counter - 1;
    } else {
        slider_count--;
    }
    console.log("update")
    update_slider();
    update_navigator();
}
function move_to_next() {
    if (slider_count === slide_counter - 1) {
        slider_count = 0;
    } else {
        slider_count++;
    }
    update_slider();
    update_navigator();
};

function update_slider() {
    for (item of slider_items){
        item.classList.add('slider-item-hide');
        item.classList.remove('slider-item-visible')
    };

    slider_items[slider_count].classList.add('slider-item-visible');
};

function update_navigator() {
    for (nav of slider_navs) {
        nav.style.background = ' rgba(255,255,255,0.4)';
    }
    slider_navs[slider_count].style.background = " rgba(255,255,255,1)";
}