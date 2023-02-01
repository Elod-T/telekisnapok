import { Election } from "@prisma/client";
import ClassWithContent from "./classWithContent";

export default interface ClassWithElectionAndContent extends ClassWithContent {
  Election: Election;
}
