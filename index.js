
const buttons = document.querySelectorAll("button.btn");
const panels = document.querySelectorAll(".panel");

buttons.forEach((button) =>{
  button.addEventListener("click", () =>{
    panels.forEach((panel) => panel.classList.remove("active"));
    document.getElementById(button.dataset.panel).classList.add("active");
  });
});


const items = document.querySelectorAll("h2,p,cards");
items.forEach((el) => el.classList.add("reveal"));

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in");
      }
    });
  },
  {threshold: 0.15}
);

items.forEach((el) => observer.observe(el));



