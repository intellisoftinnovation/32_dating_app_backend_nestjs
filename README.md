# Chomy Backend

## Setting Up the Project

1. **Clone the Project**  
   Clone the repository to your local machine:
   ```bash
   git clone git@github.com:intellisoftinnovation/32_dating_app_backend_nestjs.git

    Install Dependencies
    Navigate to the project directory and install dependencies:
    bash

cd 32_dating_app_backend_nestjs
npm install

Configure Environment Variables
Copy the template and update credentials:
bash

cp .env.template .env

Required variables for .env:
env

MONGODB_URI=mongodb+srv://<user>:<password>@<cluster-url>
PROXY_ENABLED=true
ALLOWED_ORIGINS=admin.chamoylat  # Add dashboard origin here

Run MongoDB with Docker Compose (Optional)
Start MongoDB locally:
bash

docker-compose up -d

Configure Security Settings
Update the server configuration with allowed origins, IPs, and rate limits:
javascript

const ALLOWED_ORIGINS = ["admin.chamoylat"];  // Add dashboard origins
const ALLOWED_IPS = ["192.168.1.1"];          // Whitelist IPs
const RATE_LIMIT = {
  windowMs: 60 * 1000,
  maxRequests: 500,            // Adjust for production
};

Run the Project
Start the development server:
bash

    npm run start:dev

    Access Documentation
    Visit:
    http://localhost:3000/api/0.0.1/docs

User Management
Creating Admin Users

    Register via API to create a base user

    Use MongoDB Compass to:

        Navigate to the user's metadata collection

        Add ALL_PRIVILEGES to the privileges array:
    json

    {
      "privileges": ["ALL_PRIVILEGES"]
    }

Reset Scenario

If resetting the DB:

    Re-create admin user via API

    Create management user directly in MongoDB:
    bash

    use admin
    db.createUser({
      user: "gerencia",
      pwd: "secure_password",
      roles: [{ role: "root", db: "admin" }]
    })

Network Configuration

    Whitelist IPs in MongoDB Atlas

    Enable proxy in .env:
    env

    PROXY_ENABLED=true

    Update allowed origins/IPs in server config (see Step 5 above).

Production Notes

    Set stricter rate limits:
    javascript

    const RATE_LIMIT = {
      windowMs: 60 * 1000,
      maxRequests: 100  // Reduced for production
    };

    Use npm run build + npm run start for production

    For Docker MongoDB:
    Ensure persistent volumes and network security rules are configured.

Project Structure

├── src/                 # Source code
├── .env                 # Environment config
├── docker-compose.yml   # MongoDB container setup
└── package.json         # Dependencies & scripts
