/*  Schema: Mongoose constructor to define the structure of documents in the Message collection.
    model: Function to create or retrieve a Mongoose model.
    models: Object containing registered Mongoose models, used to prevent duplicate model definitions.*/
import { Schema, model, models } from "mongoose";

/*  User Model: Links sender and recipient to User documents (from User.js), supporting user authentication and profiles.
    Property Model: Links property to Property documents, tying messages to specific listings (e.g., from PropertySearchForm or SearchResultsPage).
    Bookmark Integration: Complements bookmarkProperty, as users may message about bookmarked properties.*/
const MessageSchema = new Schema(
  {
    sender: {
      type: Schema.Types.ObjectId, // Stores a reference to a User document’s _id.
      ref: "User", // Links to the User model (from your User.js model), enabling populate for related data.
      required: true,
    },
    recipient: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    property: {
      type: Schema.Types.ObjectId,
      ref: "Property", // Links to the Property model
      required: true,
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [50, "Name cannot exceed 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    phone: String,
    body: {
      type: String,
      required: [true, "Message body is required"],
      minlength: [1, "Message cannot be empty"],
    },
    read: {
      type: Boolean,
      default: false, // New messages are marked as unread by default.
    },
  },
  {
    timestamps: true,
  }
);

/*  models.Message: Checks if the Message model is already defined (prevents redefinition in Next.js hot-reload scenarios).
    model("Message", MessageSchema): If not defined, creates a new model linked to MessageSchema.*/
const Message = models.Message || model("Message", MessageSchema);

export default Message;
