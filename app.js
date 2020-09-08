const tabItems = document.querySelectorAll(".sum");
const summaryContainer = document.querySelector(".show");


tabItems.forEach(item => {
  item.addEventListener("click", selectItems);
});

// MAIN FUNCTION
function selectItems() {
  document.querySelector(".appear-bar").style.transform=`scaleX(1)`;
  document.querySelector(".appear-bar").style.backgroundColor=`#0d77ce`;

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
  setBorder(0.15,"#0d77ce");
  summaryContainer.style.height = `65vh`;
}
function slideclose(summaryContainer) {
  setBorder(0.15,"var(--primary-color");
  summaryContainer.style.height = `0px`;
  document.querySelector(".appear-bar").style.backgroundColor=`var(--primary-color)`;
  document.querySelector(".appear-bar").style=null;

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



// Function for FAQ
const faqOpen = document.querySelectorAll(".btn-open");

faqOpen.forEach(item => {
  item.addEventListener("click", e => {
    for (let child of e.target.parentElement.parentElement.children) {
      if (child.lastElementChild.classList.contains("open")) {
        if (child.lastElementChild === e.target.nextSibling.nextSibling) {
          break;
        }
        console.log("Commit 1");
        child.lastElementChild.classList.replace("open", "close");
        child.firstElementChild.firstElementChild.classList.replace(
          "fa-times",
          "fa-plus"
        );
      }
    }

    if (e.target.nextSibling.nextSibling.classList.contains("open")) {
      console.log("Close");

      e.target.nextSibling.nextSibling.classList.replace("open", "close");
      e.target.firstElementChild.classList.replace("fa-times", "fa-plus");
    } else {
      console.log("Open");
      e.target.nextSibling.nextSibling.classList.replace("close", "open");
      e.target.firstElementChild.classList.replace("fa-plus", "fa-times");
    }
    console.log("clear");
    e.preventDefault();
  });
});
