# Shopping Assistant Website with Chatbot Recommendations

This project is a **shopping assistant website** that recommends products based on users' previous interactions. The main feature is a chatbot that provides personalized product suggestions depending on your shopping history.

## Technologies Used

### Frontend
- **React**: Used to create a dynamic and responsive user interface.

### Backend
- **Python**: Implemented the machine learning logic for product recommendations.
- **Flask**: Backend framework to connect the React frontend with the Python-based recommendation model.

### Machine Learning
- The recommendation system uses machine learning algorithms to analyze previous user interactions and provide relevant product suggestions.

---

## Features
1. **Personalized Recommendations**: 
   - The chatbot suggests products based on your past shopping items and queries.
2. **Interactive Chatbot**:
   - A conversational interface where users can ask for product suggestions.
3. **Seamless User Interface**:
   - Built using React to ensure smooth navigation and fast performance.
4. **Machine Learning Integration**:
   - Backend Python scripts analyze user data to suggest relevant products.

---

## Setup Instructions

Follow the steps below to run the project on your local machine.

### Prerequisites
- Node.js and npm (for React frontend)
- Python (v3.8+ recommended) with pip

### Frontend Setup
1. Navigate to the `frontend` directory:
   ```bash
   cd Frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   The React app will run on `http://localhost:3000`.

### Backend Setup
1. Navigate to the `backend` directory:
   ```bash
   cd Backend
   ```
2. Run this command
   ```bash
   node index.js 
   ```
   This runs backend server.

### API'S
There are two api servers one for crewai and another for Deep learning 
#### CREWAI
```bash
# Navigate to Flask api folder
- cd FlaskApi
# To run api server for model 
python app.py
# To run api server for crewAi
- cd CrewAi
- python CrewAi.py
```

## How It Works
1. **User Interaction**: Users browse products and interact with the chatbot.
2. **Data Storage**: User interactions and shopping items are stored in permanent storage(DB).
3. **DL Model**: The Python backend uses a trained recommendation model to provide relevant product suggestions.
4. **Response**: The chatbot dynamically suggests products based on analysis.

---

## Contact
For any questions or feedback:
- **Developer**: Akhil Sai Teja
- **Email**: [purmasai@gmail.com]
