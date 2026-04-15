🍽️ HUNGER’S – Smart Recipe Website with Voice Guidance

HUNGER’S is an interactive recipe web application that helps users cook delicious food with simple step-by-step instructions, voice guidance, and visual support (images/GIFs/emojis).

It is designed especially for beginners who want an easy and engaging cooking experience.

⸻

🚀 Features
	•	🔍 Search Recipes
Search for any food item and get instant results.
	•	📋 Step-by-Step Instructions
Recipes are broken down into simple, easy-to-follow steps.
	•	🔊 Voice Guidance (Text-to-Speech)
Each step can be spoken aloud to help users cook hands-free.
	•	🎨 Visual Support
Includes images, GIFs, and emojis to make cooking more interactive.
	•	⏯️ Playback Controls
	•	Play / Pause instructions
	•	Next / Previous step
	•	📱 Responsive Design
Works smoothly on desktop and mobile devices.

⸻

🛠️ Tech Stack

Frontend
	•	React.js
	•	HTML5, CSS3, JavaScript

Backend
	•	Node.js
	•	Express.js

Database
	•	MongoDB

Tools
	•	Docker 🐳
	•	Postman (API Testing)

⸻

🏗️ Project Structure

hungers/
│
├── frontend/        # React frontend
├── backend/         # Node.js backend
├── docker-compose.yml
└── README.md


⸻

⚙️ Installation & Setup

🔹 1. Clone the Repository

git clone https://github.com/your-username/hungers.git
cd hungers


⸻

🔹 2. Run using Docker (Recommended)

docker-compose up --build

	•	Frontend → http://localhost:3000
	•	Backend → http://localhost:5000

⸻

🔹 3. Run Manually (Without Docker)

Backend

cd backend
npm install
npm start

Frontend

cd frontend
npm install
npm start


⸻

🧪 API Endpoints

Method	Endpoint	Description
GET	/api/recipes	Get all recipes
GET	/api/recipes/:id	Get recipe by ID
POST	/api/recipes	Add new recipe


⸻

🎤 Voice Feature Example

const speak = (text) => {
  const speech = new SpeechSynthesisUtterance(text);
  speech.lang = "en-IN";
  window.speechSynthesis.speak(speech);
};


⸻

🌟 Future Enhancements
	•	🤖 AI-based recipe suggestions
	•	🌍 Multi-language support (Hindi, Gujarati, etc.)
	•	🎙️ Voice commands (Next, Repeat)
	•	❤️ User authentication & favorites
	•	📊 Nutrition information

⸻

📸 Screenshots (Add Later)
	•	Home Page
	•	Recipe Page
	•	Voice Feature Demo

⸻

🤝 Contributing

Contributions are welcome!
Feel free to fork the repository and submit a pull request.

⸻

📄 License

This project is licensed under the MIT License.

⸻

👨‍💻 Author

Jihan Gajjar
Diploma Computer Engineering Student

⸻

💡 Inspiration

Cooking should be simple, fun, and accessible for everyone.
HUNGER’S aims to make learning recipes easier with voice + visuals.

⸻

If you want, I can also:
✅ ￼ Create a GitHub repo structure with files
✅ ￼ Add badges + professional styling
✅ ￼ Write Dockerfile + full backend code
