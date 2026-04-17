import {v2 as cloudinary} from "cloudinary" //Imports the Cloudinary SDK, specifically the version 2 (v2) of the Cloudinary API, and assigns it to the variable cloudinary. This allows the application to interact with Cloudinary's services for tasks such as uploading and managing media files.

import {config} from "dotenv" //

config() //Loads environment variables from a .env file into process.env, allowing the application to access configuration settings such as API keys and secrets securely without hardcoding them in the source code.

cloudinary.config({ //Configures the Cloudinary SDK with the necessary credentials (cloud name, API key, and API secret) to authenticate requests to Cloudinary's services. These values are retrieved from environment variables, ensuring that sensitive information is not exposed in the codebase.
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, //The cloud name is a unique identifier for the Cloudinary account, which is required to specify where the media files will be stored and accessed.
    api_key: process.env.CLOUDINARY_API_KEY, //The API key is a public identifier for the Cloudinary account, used to authenticate requests and associate them with the correct account.
    api_secret: process.env.CLOUDINARY_API_SECRET, //The API secret is a private key used in conjunction with the API key to securely authenticate requests to Cloudinary's services, ensuring that only authorized users can access and manage media files in the account.
})

export default cloudinary; //Exports the configured Cloudinary instance, allowing other parts of the application to import and use it for tasks such as uploading images, managing media assets, and performing transformations on media files stored in Cloudinary.