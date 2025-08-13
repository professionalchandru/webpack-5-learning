import { paginationComponent } from "../Common";

const clickHandler = () => {
  window.location.replace("http://127.0.0.1:5500/src/explore.html");
  alert("pagingation clicked");
};
paginationComponent.addEventListener("click", clickHandler);
