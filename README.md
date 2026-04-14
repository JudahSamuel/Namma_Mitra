🎓 Namma Mitra
Namma Mitra is an AI-integrated campus platform designed to enhance student life and streamline operations at the Bangalore Institute of Technology. Built by and for students, it centralizes campus needs into a single, highly scalable ecosystem.

✨ Features
🤖 AI Campus Assistant: An intelligent chatbot powered by the Google Gemini API to answer campus-related queries, guide students, and provide instant support.

🛍️ Peer-to-Peer Marketplace: A dedicated platform for students to buy, sell, or trade textbooks, electronics, and other essentials within the trusted campus network.

📅 Smart Attendance System: A streamlined, efficient way to log and track attendance, making life easier for both students and faculty.

📊 Comprehensive Admin Portal: A secure dashboard to manage marketplace orders, track platform revenue, and monitor overall system health.

🛠️ Tech Stack
Namma Mitra is built using a modern JavaScript stack to ensure performance, scalability, and an excellent developer experience.

Frontend: Next.js, React

Backend: Node.js, Express.js

Database: MongoDB

AI Integration: Google Gemini API

🚀 Getting Started
Follow these instructions to set up the project locally on your machine for development and testing.

Prerequisites
Node.js (v16.x or later)

MongoDB (Local instance or MongoDB Atlas)

A Google Gemini API Key

Installation
Clone the repository:

Bash
git clone https://github.com/your-username/namma-mitra.git
cd namma-mitra
Install dependencies:

Bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
Set up Environment Variables:
Create a .env file in both the frontend and backend directories and add your keys:

Backend .env:

Code snippet
PORT=5000
MONGO_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_gemini_api_key
JWT_SECRET=your_jwt_secret
Frontend .env.local:

Code snippet
NEXT_PUBLIC_API_URL=http://localhost:5000/api
Run the Development Servers:
Open two terminal windows to run both the frontend and backend simultaneously.

Backend:

Bash
cd backend
npm run dev
Frontend:

Bash
cd frontend
npm run dev
Open the App:
Visit http://localhost:3000 in your browser to see Namma Mitra in action.

🤝 Contributing
Contributions are welcome! If you are a student at BIT and want to help improve Namma Mitra, please feel free to fork the repository, create a feature branch, and submit a Pull Request.

👨‍💻 Author
Judah - Full Stack Developer

Building a better campus experience, one line of code at a time.
