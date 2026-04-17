import { generateToken } from "../lib/utils.js"; //import function that creates jwt and stores it in cookies
import User from "../models/user.model.js"; //to represent user in our database
import bcrypt from "bcryptjs"; //to securely hash passwords before storing them in the database, and to compare hashed passwords during login
import cloudinary from "../lib/cloudinary.js"; //to upload image to cloud storage, a cloud-based image and video management service, allowing users to upload and manage their profile pictures efficiently.

export const signup = async(req,res) => { // to handle user registration, allowing new users to create an account by providing their email, fullname, and password. The function validates the input, checks for existing users, hashes the password, and creates a new user in the database.
    const {email, fullName, password}= req.body; // to get user input: destructure the request body to get email, fullname, and password   
    try{
        if(!email || !fullName || !password){ //to prevent empty fields
            return res.status(400).json({message: "All fields are required"}) //to ensure that all required fields (email, fullname, and password) are provided by the user. If any of these fields are missing, it responds with a 400 status code and an error message indicating that all fields are required.
        }

        if(password.length < 6){ //to prevent weak passwords, by enforcing a minimum length requirement of 6 characters for the password. If the password is too short, it responds with a 400 status code and an error message.
            return res.status(400).json({message: "Password must be at least 6 characters long"}) //400 status code indicates a bad request, meaning the client sent invalid data. The JSON response includes a message explaining the reason for the error, which in this case is that the password does not meet the minimum length requirement.
        }

        const user = await User.findOne({email})    //to check if user exists: it searches the database for existing mail

        if(user){ //if user exist prevent duplicate accounts
            return res.status(400).json({message: "Email already exists"}) //to stop duplicate accounts
        }
        const salt =await bcrypt.genSalt(10) // generate a random salt for hashing the password, with a cost factor of 10 :salt is a random data added before hashing the password to enhance security. The cost factor of 10 determines the computational complexity of the hashing process, making it more resistant to brute-force attacks.
        const hashedPassword = await bcrypt.hash(password, salt) // hash the password using the generated salt  
        
        const newUser = new User({ //to create a new user instance with the provided email, fullName, and the securely hashed password. This instance is then saved to the database.
            fullName,
            email,
            password: hashedPassword
        })
    
        if(newUser){
            //generate jwt token here 
            generateToken(newUser._id, res); //create jwt and store it in cookies
            await newUser.save() //save user to db

            res.status(201).json({ //send success response
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic,
            })
        }
        else{
            res.status(400).json({message: "Invalid user data"})
        }
    }
    catch(error){ //catches the error and logs it to the console, while also sending a 500 status code response with a message indicating an internal server error. This helps in debugging and informs the client that something went wrong on the server side.
        console.log("Error in signup controller", error.message)
        res.status(500).json({message: "Internal server error"})
    }
}

export const login = async(req,res) => {
    const {email,password} = req.body //get login details from request body
    try{
        const user = await User.findOne({email}) //to check if the mail exists in the database

        if(!user){ //if user does not exist in the database return this message
            return res.status(400).json({message: "Invalid Credentials"}) //to prevent attackers from knowing whether the email or password is incorrect, enhancing security by providing a generic error message for invalid login attempts. This approach helps to protect user information and makes it more difficult for attackers to guess valid email addresses or passwords based on error messages.    
        }

        const isPasswordCorrect =await bcrypt.compare(password, user.password) //if the email exist in the db compare the password you are just entering with the password in the db
        //compare entered password with the hashed password in db

        if(!isPasswordCorrect){ //if the password is not correct return this message
            return res.status(400).json({message: "Invalid Credentials"})
        }
        generateToken(user._id,res) //else if it is correct generate token and log user in
        //log user in by generating a token and sending user data as response
        res.status(200).json({
            _id:user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic,
        })
    }
        catch (error){
            console.log("Error in login controller", error.message)
            res.status(500).json({
                message: "Internal Server Error"
            })
        }
    }

export const logout = (req,res) => {
    try{
        res.cookie("jwt", "", {maxAge:0}) //Clears cookie → logs out user
        res.status(200).json({message: "Logged out successfully"})
    }
    catch(error){
        console.log("Error in logout controller", error.message)
        res.status(500).json({message:"Internal Server Error"})
    }
}

export const updateProfile = async(req, res) => {
    try{
        const {profilePic} = req.body //get the profile picture from the request body, which is expected to be a base64-encoded string representing the image. This allows the user to update their profile picture by sending the new image data in the request.
        const userId = req.user._id //Gets logged-in user ID (from middleware)

        if(!profilePic){ //if no profile picture is provided in the request body, it responds with a 400 status code and a message indicating that the profile picture is required. This ensures that the user cannot update their profile without providing a new profile picture.
            return res.status(400).json({message: "Profile pic is required"}) //to ensure that the user cannot update their profile without providing a new profile picture.
        }

        const uploadResponse =await cloudinary.uploader.upload(profilePic) //Uploads the base64 image to Cloudinary using the Cloudinary SDK. The upload method takes the base64 string and uploads it to Cloudinary's servers, returning a response that includes details about the uploaded image, such as its URL.
        const updatedUser =await User.findByIdAndUpdate(userId, {profilePic: uploadResponse.secure_url}, {new: true}) //Updates the user's profile picture URL in the database. It uses the findByIdAndUpdate method to find the user by their ID and update the profilePic field with the secure URL of the uploaded image from Cloudinary. The { new: true } option ensures that the updated user document is returned in the response.
        res.status(200).json(updatedUser) //Sends the updated user data as a JSON response, allowing the client to see the changes made to the user's profile, including the new profile picture URL.
    }
    catch(error){
        console.log("Error in updateProfile controller", error.message)//If any error occurs during the profile update process, it logs the error message to the console and responds with a 500 status code along with a message indicating an internal server error. This helps in debugging and informs the client that something went wrong on the server side.
        res.status(500).json({message: "Internal Server Error"})    //to handle any unexpected errors that may occur during the profile update process, ensuring that the server responds appropriately and provides feedback to the client in case of an error.
    }
}

export const checkAuth = (req, res) => {     //to check if the user is authenticated by verifying the JWT token and returning the user's information if the token is valid. This function is typically used to confirm that a user is logged in and to retrieve their details for use in the application.
    try{
        res.status(200).json(req.user) //If the user is authenticated, it sends a 200 status code along with the user's information (stored in req.user by the authentication middleware) as a JSON response. This allows the client to access the authenticated user's details, such as their ID, full name, email, and profile picture.
    }
    catch(error){
        console.log("Error in checkAuth controller", error.message) //If any error occurs while checking authentication, it logs the error message to the console and responds with a 500 status code along with a message indicating an internal server error. This helps in debugging and informs the client that something went wrong on the server side.
        res.status(500).json({message: "Internal Server Error"})
    }
}

