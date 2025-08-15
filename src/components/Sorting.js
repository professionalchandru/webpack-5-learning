import { sortingComponent } from "../Common";

const clickHandler = () => {
  import("lodash").then(({ default: _ }) => {
    alert(`thank you for visiting. and your bill is ${_.add(200 + 300)}`);
  });
};
sortingComponent.addEventListener("click", clickHandler);
