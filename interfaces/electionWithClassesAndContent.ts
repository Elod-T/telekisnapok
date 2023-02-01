import { Election } from "@prisma/client";
import ClassWithContent from "./classWithContent";

export default interface ElectionWithClassesAndContent extends Election {
  Classes: ClassWithContent[];
}
