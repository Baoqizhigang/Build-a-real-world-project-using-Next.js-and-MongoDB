"use server"; // Declares this as a Next.js server action, ensuring the code runs on the server side, suitable for database operations and sensitive logic.
import connectDB from "@/config/database"; // Custom function to connect to MongoDB
import Message from "@/models/Message"; // Mongoose model for the Message collection (from Message.js).
import { getSessionUser } from "@/utils/getSessionUser"; // Utility to retrieve the current authenticated user’s ID.

// Defines an asynchronous function addMessage that accepts a formData object
// typically a FormData instance from a form submission.
async function addMessage(previousState, formData) {
  // Establishes a connection to MongoDB
  await connectDB();

  const sessionUser = await getSessionUser(); // Retrieves the authenticated user via getSessionUser.

  // Validates the presence of sessionUser and userId, throwing an error if missing (ensures only logged-in users can send messages).
  if (!sessionUser || !sessionUser.userId) {
    throw new Error("User ID is required");
  }
  //Destructures userId for use as the message’s sender.
  const { userId } = sessionUser;
  // extracts the recipient (a User ID) from formData.
  const recipient = formData.get("recipient");
  //Checks if the sender (userId) equals the recipient, returning an error object if true (prevents self-messaging).
  if (userId === recipient) {
    return { error: "You can not send a message to yourself" };
  }

  /*Creates a new Message document using the Message model, populating fields:
    sender: Current user’s ID (userId).
    recipient: Recipient’s user ID (from formData).
    property: Property ID (from formData), referencing a Property document.
    name, email, phone, body: Message details from formData. */
  const newMessage = new Message({
    sender: userId,
    recipient,
    property: formData.get("property"),
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    body: formData.get("body"),
  });
  // Saves the newMessage document to the messages collection, triggering Mongoose validations (e.g., required fields).
  await newMessage.save();
  // Returns a success response indicating the message was saved.
  return { submitted: true };
}

//Exports the function as a server action, callable from client components (e.g., via a form’s action attribute).
export default addMessage;
