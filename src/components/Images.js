import { imgComponent } from "../Common";
import im from "../Assets/image.png";
import { sortingComponent } from "../Common";

sortingComponent.addEventListener("click", () => {
  imgComponent.src = im;
});
