
// model User {
//   id        String  @id @default(cuid())
//   clerkId   String  @unique
//   email     String  @unique
//   name      String?
//   createdAt DateTime @default(now())
//   updatedAt DateTime @updatedAt

//   notes Note[]
// }

// model Note {
//   id        String   @id @default(cuid())
//   authorId  String
//   title     String
//   content   String
//   createdAt DateTime @default(now())
//   updatedAt DateTime @updatedAt

//   user User @relation(fields: [authorId], references: [id], onDelete: Cascade)
// }