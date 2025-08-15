import { sortingComponent } from "../Common";

import _ from "lodash";
import dayjs from "dayjs";

const clickHandler = () => {
  alert(
    `thank you for visiting ${dayjs().format(
      "DD MM YYY"
    )} and your bill is ${_.add(200 + 300)}`
  );
};
sortingComponent.addEventListener("click", clickHandler);
