import mongoose from "mongoose";

const messageSchema = new mongoose.Schema( //to define a Mongoose schema for the Message model, which represents the structure of the messages stored in the MongoDB database. The schema defines the fields and their types, as well as any validation rules or references to other models.
    {
        senderId:{//to define the senderId field, which is a reference to the User model. This field is required and will store the ObjectId of the user who sent the message. By using ref: "User", it establishes a relationship between the Message and User models, allowing for population of user details when querying messages.
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        receiverId:{//to define the receiverId field, which is also a reference to the User model. This field is required and will store the ObjectId of the user who is the recipient of the message. Similar to senderId, it establishes a relationship between the Message and User models, enabling population of user details when querying messages.
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        text: {//to define the text field, which is a string that will store the content of the message. This field is not required, allowing for messages that may only contain an image without text.
            type: String,
        },
        image: {//to define the image field, which is a string that will store the URL of an image associated with the message. This field is not required, allowing for messages that may only contain text without an image.
            type: String,
        },
    },
    {
        timestamps: true //to enable automatic creation of createdAt and updatedAt fields in the Message documents. This allows for tracking when each message was created and last updated, which can be useful for sorting messages by time or displaying timestamps in the user interface.
    }
)

const Message = mongoose.model("Message", messageSchema) //to create a Mongoose model named "Message" based on the defined messageSchema. This model provides an interface for interacting with the messages collection in the MongoDB database, allowing for creating, reading, updating, and deleting message documents according to the structure defined in the schema.
export default Message