# JotPsych Full Stack Coding Challenge - Project Documentation

## Project Overview

This project is a full-stack application with a Flask backend API and a React frontend. It includes user authentication, profile management, and an audio recording feature with mock transcription.

## Backend (Flask API)

### Models

#### User Model

- Fields: `id`, `username`, `password`, `name`, `bio`, `profile_pic_url`, `motto`
- The `motto` field is encrypted before storage and decrypted when retrieved
- Utilizes the `cryptography` library for `motto` encryption/decryption

### Endpoints

#### 1. Register Endpoint

- **Path**: `/register`
- **Method**: POST
- **Function**:
  - Handles user registration with all user fields
  - Encrypts the `motto` before database storage
  - Creates a new `User` instance and commits to the database
  - Generates and returns an access token for the new user
- **Request Body**: JSON with `username`, `password`, `name`, `bio`, `profile_pic_url`, `motto`
- **Response**: JSON with `access_token` and success message

#### 2. Login Endpoint

- **Path**: `/login`
- **Method**: POST
- **Function**:
  - Authenticates user credentials
  - Generates an access token upon successful authentication
  - Stores the access token in the session
- **Request Body**: JSON with `username` and `password`
- **Response**: JSON with `access_token` and success message

#### 3. User Endpoint

- **Path**: `/user`
- **Method**: GET
- **Function**:
  - Retrieves user information based on JWT identity
  - Returns user data including decrypted `motto`
- **Authentication**: Required (JWT)
- **Response**: JSON with user data (`username`, `name`, `bio`, `profile_pic_url`, decrypted `motto`) or 404 error

#### 4. Logout Endpoint

- **Path**: `/logout`
- **Method**: POST
- **Function**:
  - Invalidates the user's JWT token
  - Clears the session data
- **Authentication**: Required (JWT)
- **Response**: JSON with success message

#### 5. Transcription Endpoint

- **Path**: `/upload`
- **Method**: POST
- **Function**:
  - Handles audio file upload
  - Mocks transcription service (simulates 5-15 second delay)
  - Updates user's `motto` with transcribed text (encrypted)
- **Authentication**: Required (JWT)
- **Request Body**: Multipart form data with audio file
- **Response**: JSON with transcription result and success message

#### 6. Version Check Endpoint

- **Path**: `/check`
- **Method**: GET
- **Function**:
  - Verifies the application version
  - Used in conjunction with the version check middleware
- **Response**: JSON with status "OK" if version is compatible

### Middleware

- **Version Check**
  - Implemented in `app.before_request`
  - Ensures `app-version` header is >= 1.2.0
  - Returns update prompt if version is outdated (426 status code)

### Asynchronous Processing

- Endpoints `/register`, `/login`, `/user`, `/logout` and `/upload` are asynchronous
- Allows simultaneous request handling without blocking

### Security

- Password hashing using bcrypt
- JWT for authentication
- Motto encryption using Fernet (symmetric encryption)

## Frontend (React)

### Components

#### 1. Register Component (Register.tsx)

- Handles user registration with all fields
- Uses APIService for network requests

#### 2. Login Component (Login.tsx)

- Handles user login
- Stores JWT token in localStorage and AuthContext

#### 3. Home Component (Home.tsx)

- Landing page with login/register options
- Redirects to profile if user is authenticated

#### 4. Profile Component (Profile.tsx)

- Displays user information
- Includes AudioRecorder component for motto recording

#### 5. AudioRecorder Component (AudioRecorder.tsx)

- Uses MediaRecorder API to record up to 15 seconds of audio
- Sends recorded audio to backend for transcription

#### 6. UpdateMessage Component (UpdateMessage.tsx)

- Displays update message if app version is outdated

#### 7. LogoutButton Component (LogoutButton.tsx)

- Handles user logout

### Services

#### APIService (APIService.ts)

- Centralized service for all API requests
- Includes `app-version` header with every request
- Handles token storage and retrieval

#### AuthContext (AuthContext.tsx)

- Manages authentication state across the application
- Provides methods to set and get the token

### Styling

- Uses Material-UI components for improved UI
- Custom CSS for additional styling

## Scaling to Enterprise Level

1. **Database Scaling**

   - Implement horizontal scaling and sharding
   - Use distributed database systems (e.g., Amazon RDS, Google Cloud SQL)

2. **Load Balancing**

   - Use load balancers (e.g., AWS ELB, NGINX) to distribute traffic

3. **Caching**

   - Implement Redis or Memcached for frequently accessed data

4. **Asynchronous Processing**

   - Use message brokers (RabbitMQ, Apache Kafka) for background tasks

5. **Enhanced Security**

   - Implement OAuth2, HTTPS, and regular security audits
   - Use environment variables for sensitive data

6. **CI/CD Pipeline**

   - Set up automated testing, integration, and deployment

7. **Monitoring and Logging**

   - Implement tools like Prometheus, Grafana, and ELK Stack

## Future Improvements

1. Implement proper error handling and validation
2. Add unit and integration tests
3. Enhance the audio recording feature (e.g., allow re-recording, display waveform)
4. Implement real-time updates for user profile changes
5. Add user avatar upload functionality
6. Implement password reset feature
7. Add social authentication options (Google, Facebook, etc.)
8. Implement rate limiting to prevent abuse
9. Add pagination for data fetching in case of large datasets
10. Implement WebSockets for real-time features (e.g., live transcription updates)

## Known Issues and Resolutions

1. Token invalidation on logout needs to be implemented server-side
2. Error handling in some components needs improvement
3. The mock transcription service doesn't actually transcribe the audio
4. The frontend doesn't handle all possible error states from the backend
5. After login the logout seens to give an error sometimes but with register works perfectly

This documentation provides a comprehensive overview of the current state of the project, including implemented features, code structure, API endpoints, frontend components, scaling considerations, and suggestions for future improvements. It serves as a solid foundation for further development and can be easily updated as the project evolves.
