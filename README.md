```markdown
# Chomy Backend

## Setting Up the Project

1. **Clone the Project**  
   Clone the repository to your local machine using the following command:
   ```bash
   git clone git@github.com:intellisoftinnovation/32_dating_app_backend_nestjs.git
   ```

2. **Install Dependencies**  
   Navigate to the project directory and install the required dependencies:
   ```bash
   cd 32_dating_app_backend_nestjs
   npm install
   ```

3. **Configure Environment Variables**  
   Copy the `.env.template` file to `.env` and update the necessary environment variables:
   ```bash
   cp .env.template .env
   ```
   Open the `.env` file and fill in the required environment variables, such as database credentials, API keys, etc. If you don't have a MongoDB database set up, you can proceed to the next step.

4. **Run MongoDB with Docker Compose (Optional)**  
   If you don't have MongoDB installed, you can set it up using Docker Compose. Make sure Docker is installed on your machine and run the following command:
   ```bash
   docker-compose up -d
   ```
   This will start a MongoDB container ready to use. Ensure the environment variables in `.env` point to this MongoDB instance.

5. **Run the Project**  
   Start the development server using the following command:
   ```bash
   npm run start:dev
   ```

6. **Access the Documentation**  
   Once the server is running, you can access the API documentation by navigating to:
   ```
   http://localhost:3000/api/0.0.1/docs
   ```
   Replace `localhost:3000` with your server's URL if it's hosted elsewhere.

---

## Project Structure

- **`src/`**: Contains the source code of the application.
- **`.env`**: Environment variables configuration.
- **`.env.template`**: Template for environment variables.
- **`package.json`**: Lists project dependencies and scripts.

---

## Additional Information

- Ensure you have Node.js and npm installed on your machine.
- For production deployment, consider using `npm run build` and `npm run start`.
- If you use Docker Compose to run MongoDB, ensure the service is properly configured in the `docker-compose.yml` file.

