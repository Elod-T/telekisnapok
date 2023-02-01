import { Class, Content } from "@prisma/client";

export default interface ClassWithContent extends Class {
  Content: Content;
}
