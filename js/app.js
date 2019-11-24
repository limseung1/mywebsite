const tab1 = document.querySelector("#tab-1-content");
const tab2 = document.querySelector("#tab-2-content");
const tab3 = document.querySelector("#tab-3-content-1");

const tabSelector1 = document.querySelector("#tab-1");
const tabSelector2 = document.querySelector("#tab-2");
const tabSelector3 = document.querySelector("#tab-3");

tabSelector1.addEventListener("click", function(e) {
  tab1.style.display = "block";
  tab2.style.display = "none";
  tab3.style.display = "none";

  tabSelector1.style.color = "red";
  tabSelector2.style.color = "";
  tabSelector3.style.color = "";

  tabSelector1.classList.add("tab-border");
  tabSelector2.classList.remove("tab-border");
  tabSelector3.classList.remove("tab-border");

  e.preventDefault();
});
tabSelector2.addEventListener("click", function(e) {
  tab1.style.display = "none";
  tab2.style.display = "block";
  tab3.style.display = "none";

  tabSelector1.style.color = "";
  tabSelector2.style.color = "red";
  tabSelector3.style.color = "";

  tabSelector1.classList.remove("tab-border");
  tabSelector2.classList.add("tab-border");
  tabSelector3.classList.remove("tab-border");
  e.preventDefault();
});
tabSelector3.addEventListener("click", function(e) {
  tab1.style.display = "none";
  tab2.style.display = "none";
  tab3.style.display = "block";

  tabSelector1.style.color = "";
  tabSelector2.style.color = "";
  tabSelector3.style.color = "red";

  tabSelector1.classList.remove("tab-border");
  tabSelector2.classList.remove("tab-border");
  tabSelector3.classList.add("tab-border");
  e.preventDefault();
});

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
