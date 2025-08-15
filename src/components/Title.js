import { titleComponent } from "../Common";

import _ from "lodash";
import dayjs from "dayjs";

titleComponent.innerHTML = `thank you for visiting ${dayjs().format(
  "DD MM YYY"
)} and your bill is ${_.add(200 + 300)}`;
