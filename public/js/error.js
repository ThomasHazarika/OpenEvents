const homeBtn = document.getElementById("home-btn");
const backBtn = document.getElementById("back-btn");

backBtn.addEventListener("click", () => {
  window.history.back();
});

homeBtn.addEventListener("click", () => {
  window.location.href = "/events";
});
