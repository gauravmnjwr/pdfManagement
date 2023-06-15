# PDF Management Project

This project is a PDF management application built using the MERN stack (MongoDB, Express.js, React.js, and Node.js). The application allows users to sign up, sign in, upload PDF files, view PDFs, share PDFs with friends, and collaborate by adding comments to the PDFs.

## Features

- User Authentication: Users can sign up with a unique username and password and securely sign in to the application.
- PDF Upload: Authenticated users can upload PDF files to the application.
- PDF Viewing: Users can view PDF files directly within the application.
- PDF Sharing: Users can share PDFs with their friends by providing them with the appropriate access.
- Collaboration: Users can collaborate on PDFs by adding comments and engaging in discussions with other users.

## Technologies Used

- **MongoDB**: A NoSQL database used to store user data, PDF files, and comments.
- **Express.js**: A web application framework used to build the backend API for the application.
- **React.js**: A JavaScript library used to build the user interface and provide a responsive and interactive experience.
- **Node.js**: A JavaScript runtime used to execute server-side code and handle backend operations.
- **Passport.js**: A library used for user authentication and session management.
- **Multer**: A middleware used to handle file uploads.
- **bcrypt**: BCrypt Algorithm is used to hash and salt passwords securely.
- **React-pdf-viewer**: A JavaScript library used to render PDF files in the browser.

## Getting Started

To run this application locally, follow the steps below:

1. Clone the repository:

   ```bash
   git clone https://github.com/gauravmnjwr/pdfManagement.git
   ```

2. Change to the project directory:

   ```bash
   cd pdf-management
   ```

3. Install the dependencies for the backend and frontend:

   ```bash
   # Install backend dependencies
   cd backend
   npm install

   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

4. Configure the environment variables:

   - Create a `.env` file in the `backend` directory.
   - Set the following variables in the `.env` file:

     ```bash
     PORT=3000
     MONGODB_URI=your-mongodb-connection-uri
     SECRET_KEY=your-session-secret
     ```

5. Start the backend and frontend servers:

   ```bash
   # Start the backend server
   cd backend
   npm start

   # Start the frontend server
   cd ../frontend
   npm start
   
   # Start both frontend/backend server
   cd root-dir
   npm run dev
   ```
   
   

6. Access the application in your browser:

   Open your browser and navigate to `http://localhost:3000` to access the PDF management application.

## Folder Structure

The project's folder structure is as follows:

- `backend`: Contains the server-side code, including the API routes, authentication logic, and database configuration.
- `frontend`: Contains the client-side code, including the React components, stylesheets, and assets.

## Contributing

Contributions are welcome! If you'd like to contribute to this project, please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Make your changes and commit them.
4. Push your changes to your fork.
5. Submit a pull request detailing your changes.

## License

This project is licensed under the [MIT License](LICENSE).

## Acknowledgements

This project was inspired by the need for a PDF management system that allows users to easily upload, view, share, and collaborate on PDF files. Special thanks to the open-source community for providing the tools and libraries that made this project possible.
