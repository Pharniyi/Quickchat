import User from "../models/user.model.js" //to interact with the User model for database operations related to user data, such as retrieving user information, updating profiles, and managing authentication.
import Message from "../models/message.model.js" //to interact with the Message model for database operations related to messaging functionality, such as retrieving messages between users and saving new messages to the database.
import cloudinary from "../lib/cloudinary.js" //to handle image uploads to Cloudinary, which is a cloud-based service for managing and delivering images. This allows the application to upload and store images (such as profile pictures and message attachments) in the cloud, providing a scalable and efficient way to manage media files.

export const getUsersForSidebar = async (req, res) => { //to retrieve a list of users for the sidebar, excluding the currently logged-in user. This function queries the database for all users except the one making the request and returns their information (excluding passwords) as a JSON response, allowing the frontend to display a list of other users in the sidebar for messaging or interaction purposes.

    try{
        const loggedInUserId = req.user._id //to get the ID of the currently logged-in user from the request object, which is populated by the authentication middleware. This ID is used to filter out the logged-in user from the list of users retrieved from the database, ensuring that the sidebar only displays other users for interaction.
        const filteredUsers = await User.find({_id: {$ne: loggedInUserId}}).select("-password")//to query the database for all users except the one with the ID of the currently logged-in user. The $ne operator is used to specify that the _id field should not be equal to the logged-in user's ID. Additionally, the select("-password") method is used to exclude the password field from the returned user documents, ensuring that sensitive information is not sent to the client.
        res.status(200).json(filteredUsers)//to send the filtered list of users as a JSON response with a 200 status code, allowing the frontend to receive and display the list of other users in the sidebar for messaging or interaction purposes.
    }
    catch(error){//to handle any errors that may occur during the process of retrieving users for the sidebar. If an error occurs, it logs the error message to the console and responds with a 500 status code along with a message indicating an internal server error. This helps in debugging and informs the client that something went wrong on the server side while trying to fetch the user list.
        console.log("Error in getUsersForSidebar controller", error.message)//to log the error message to the console for debugging purposes, providing insight into what went wrong during the execution of the getUsersForSidebar function.
        res.status(500).json({message: "Internal Server Error"})//to respond with a 500 status code and a JSON message indicating an internal server error, informing the client that something went wrong on the server side while trying to fetch the user list for the sidebar.
    }
} 

export const getMessages = async(req,res) => { //to retrieve messages between the currently logged-in user and another user specified by the ID in the request parameters. This function queries the database for messages where either the sender is the logged-in user and the receiver is the specified user, or vice versa. It then returns the list of messages as a JSON response, allowing the frontend to display the conversation between the two users.
    try{
        const {id:userToChatId} = req.params //to extract the ID of the user to chat with from the request parameters. This ID is used to query the database for messages exchanged between the logged-in user and the specified user, enabling the retrieval of their conversation history.
        const myId = req.user._id //to get the ID of the currently logged-in user from the request object, which is populated by the authentication middleware. This ID is used in conjunction with the userToChatId to query the database for messages exchanged between the two users, allowing the application to retrieve and display their conversation history.

        const messages = await Message.find({ //to query the database for messages where either the sender is the logged-in user and the receiver is the specified user, or vice versa. The $or operator is used to specify that either of these conditions can be true for a message to be included in the results. This allows the application to retrieve all messages exchanged between the two users, regardless of who sent them.
            $or:[ //to specify that either of the following conditions can be true for a message to be included in the results:
                {senderId: myId, receiverId: userToChatId}, //to include messages where the sender is the logged-in user and the receiver is the specified user.
                {senderId: userToChatId, receiverId: myId} //to include messages where the sender is the specified user and the receiver is the logged-in user.
            ]
        })
        res.status(200).json(messages) //to send the retrieved messages as a JSON response with a 200 status code, allowing the frontend to receive and display the conversation history between the logged-in user and the specified user.
    }
    catch(error){ //to handle any errors that may occur during the process of retrieving messages between the two users. If an error occurs, it logs the error message to the console and responds with a 500 status code along with a message indicating an internal server error. This helps in debugging and informs the client that something went wrong on the server side while trying to fetch the messages for the conversation.
        console.log("Error in getMessages controller", error.message) //to log the error message to the console for debugging purposes, providing insight into what went wrong during the execution of the getMessages function.
        res.status(500).json({message: "Internal Server Error"}) //to respond with a 500 status code and a JSON message indicating an internal server error, informing the client that something went wrong on the server side while trying to fetch the messages for the conversation between the logged-in user and the specified user.
    }
}

export const sendMessage = async(req, res) => { //to handle the sending of a message from the currently logged-in user to another user specified by the ID in the request parameters. This function extracts the message text and an optional image from the request body, uploads the image to Cloudinary if it exists, creates a new message document in the database with the sender and receiver information, and returns the newly created message as a JSON response. This allows the frontend to send messages and display them in real-time (with future implementation of socket.io) between users in the chat application.
    try{
        const {text, image} =req.body //to extract the message text and an optional image from the request body. The text represents the content of the message being sent, while the image (if provided) is expected to be a base64-encoded string representing an image that can be uploaded to Cloudinary. This allows the sender to include both text and images in their messages when communicating with other users in the chat application.
        const {id:receiverId} = req.params //to extract the ID of the receiver (the user to whom the message is being sent) from the request parameters. This ID is used to associate the message with the correct recipient in the database, ensuring that the message is delivered to the intended user in the chat application.
        const senderId = req.user._id //to get the ID of the currently logged-in user (the sender) from the request object, which is populated by the authentication middleware. This ID is used to associate the message with the correct sender in the database, ensuring that the message is attributed to the user who sent it in the chat application.

        let imageUrl; //to initialize a variable to hold the URL of the uploaded image. If an image is provided in the request body, it will be uploaded to Cloudinary, and the secure URL of the uploaded image will be stored in this variable. This allows the message to include a reference to the image that can be displayed in the chat application.
        if(image){ //to check if an image is provided in the request body. If an image exists, it proceeds to upload the base64-encoded image to Cloudinary and retrieves the secure URL of the uploaded image, which is then stored in the imageUrl variable. This allows the message to include an image attachment that can be displayed in the chat application alongside the text content of the message.
            //upload base 64 image to cloudinary and get the url
            const uploadResponse = await cloudinary.uploader.upload(image) //to upload the base64-encoded image to Cloudinary using the Cloudinary SDK. The upload method takes the base64 string and uploads it to Cloudinary's servers, returning a response that includes details about the uploaded image, such as its URL. This allows the application to store and manage images in the cloud, providing a scalable solution for handling media files in the chat application.
            imageUrl = uploadResponse.secure_url; //to store the secure URL of the uploaded image in the imageUrl variable. This URL can be used to reference the image in the message document that will be created in the database, allowing the frontend to display the image alongside the message text in the chat application.
        }

        const newMessage = new Message({ //to create a new message document using the Message model. The new message includes the sender's ID, receiver's ID, message text, and an optional image URL if an image was provided and uploaded to Cloudinary. This document will be saved to the database, allowing the message to be stored and retrieved later for display in the chat application.
            senderId,
            receiverId,
            text,
            image: imageUrl
        })

        await newMessage.save() //to save the newly created message document to the database. This operation persists the message, allowing it to be retrieved later when fetching messages for the conversation between the sender and receiver. Saving the message ensures that it is stored in the database and can be accessed for display in the chat application, as well as for any future features such as message history or real-time updates with socket.io.
        //todo realtime functionality using socket.io
        res.status(201).json(newMessage) //to send the newly created message as a JSON response with a 201 status code, indicating that the message was successfully created. This allows the frontend to receive the details of the sent message, including its ID, sender and receiver information, text content, and image URL (if applicable), enabling the frontend to display the new message in the chat interface in real-time (with future implementation of socket.io) between users in the chat application.

    }
    catch(error){ //to handle any errors that may occur during the process of sending a message. If an error occurs, it logs the error message to the console and responds with a 500 status code along with a message indicating an internal server error. This helps in debugging and informs the client that something went wrong on the server side while trying to send the message in the chat application.
        console.log("Error in sendMessage controller", error.message) //to log the error message to the console for debugging purposes, providing insight into what went wrong during the execution of the sendMessage function.
        res.status(500).json({message: "Internal Server Error"}) //to respond with a 500 status code and a JSON message indicating an internal server error, informing the client that something went wrong on the server side while trying to send the message in the chat application.
    }
}