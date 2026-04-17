import jwt from 'jsonwebtoken'; //to import the jsonwebtoken library, which is used for creating and verifying JSON Web Tokens (JWTs). JWTs are a compact and self-contained way to securely transmit information between parties as a JSON object. This library provides methods for signing and verifying tokens, making it easier to implement authentication and authorization in web applications.

export const generateToken = (userId, res) => {//to define a function named generateToken that takes a userId and a response object (res) as parameters. This function is responsible for generating a JWT token for the authenticated user and sending it as a cookie in the response. The token will contain the user's ID and will be signed using a secret key, allowing the server to verify the token's authenticity in subsequent requests.
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, { //to create a JWT token using the jwt.sign() method. The payload of the token includes the userId, which is the unique identifier for the authenticated user. The token is signed with a secret key (process.env.JWT_SECRET) to ensure its integrity and prevent tampering. The expiresIn option is set to '7d', which means the token will expire after 7 days, providing a balance between security and user convenience.
        expiresIn: '7d' // to specify the expiration time for the token, which is set to 7 days. This means that the token will be valid for 7 days from the time it is generated, after which it will expire and the user will need to log in again to obtain a new token. Setting an expiration time helps to enhance security by limiting the lifespan of the token and reducing the risk of unauthorized access if the token is compromised.
    });
    
    res.cookie("jwt", token, {//to set a cookie named "jwt" in the response, with the value of the generated token. The cookie is configured with several options to enhance security and control its behavior:
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
        httpOnly: true, // to prevent client-side JavaScript from accessing the cookie, enhancing security against XSS attacks.
        secure: process.env.NODE_ENV !== "development", // to ensure that the cookie is only sent over HTTPS connections in production environments, providing an additional layer of security by encrypting the data transmitted between the client and server.
        sameSite: "strict" // to prevent the browser from sending the cookie along with cross-site requests, providing protection against CSRF attacks.
    })

    return token;//to return the generated token, allowing the calling function to have access to the token if needed for further processing or logging. This can be useful for debugging purposes or for sending the token in the response body if required by the client.
}