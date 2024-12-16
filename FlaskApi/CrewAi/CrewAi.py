from crewai import Crew, Process, Agent, Task, LLM
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os

load_dotenv()
app = Flask(__name__)
CORS(app)

llm = LLM(
    model= "groq/llama3-8b-8192",
    api_key=os.getenv("API_KEY")
)

#constants
categories = ['Casual', 'Sports', 'Formal', 'Ethnic', 'Party', 'Smart Casual', 'Travel']

# Agents

#Gender Agent
gender_detector = Agent(
    role="Gender Detector",
    goal="Identify and classify genders (Men, Women, Unisex) from the given input text.",
    verbose=True,
    backstory=(
        "You are a skilled linguistic analyst, adept at interpreting input and categorizing it into gender-based groups: "
        "Men, Women, and Unisex."
    ),
    llm=llm,
    max_iter=5,
    tools=[],  # Add relevant tools if needed.
    max_rpm=20
)

# Category Agent
category_detector = Agent(
    role="Category Detector",
    goal=(
        f"Classify the input text into one or more of the predefined categories: {categories}. Pay close attention to the user's context, "
        f"such as their stated activity, destination, preferences, and overall intent. If the input suggests multiple occasions or activities, provide all applicable categories in an array format."
        f"Ensure the classification is precise and contextually relevant."
    ),
    verbose=True,
    backstory=(
        "You are a seasoned fashion and lifestyle expert known for understanding the subtle nuances of user needs. "
        "By analyzing the provided input, you excel at identifying the user's activity, location, and intent, and mapping "
        "it to the most appropriate categories. Your expertise ensures that the output is tailored to the user's requirements, "
        "whether it's for formal events, casual outings, travel plans, or traditional occasions."
    ),
    llm=llm,
    max_iter=5,
    tools=[],  # Add relevant tools if needed.
    max_rpm=20
)

# Tasks
# Gender Task
gender_task = Task(
    description=''' The user has provided the following input: {userMessage}.  Analyze the input text and classify the gender as Men, Women, or Unisex. ''',
    expected_output="One of: Men, Women, Unisex. ",
    agent=gender_detector,
)

# Category Task
category_task = Task(
    description=(
        "The user has provided the following input: {userMessage}. "
        f"Analyze the input text to understand the occasion, activity, and user preferences. "
        f"Classify it into one or more of the predefined categories: {categories}. "
        f"Consider details like the user's age, and the context of the activity "
        f"to make an informed classification. If multiple categories are relevant, include all applicable categories in the output."
    ),
    expected_output=(
        "An array of one or more categories from: 'Casual', 'Sports', 'Formal', 'Ethnic', "
        "'Party', 'Smart Casual', 'Travel'. The categories should reflect the user's intent and context."
    ),
    agent=category_detector,
)

crew = Crew(
    agents=[gender_detector, category_detector],
    tasks=[gender_task, category_task],
    process=Process.sequential 
)


@app.route('/classify', methods=['POST'])
def classify():
    try:
        # Get user input from JSON request
        user_message = request.json.get('userMessage', '')

        if not user_message:
            return jsonify({"error": "userMessage is required"}), 400

        # Prepare inputs for the crew
        inputs = {"userMessage": user_message}

        # Run CrewAI processing
        result = crew.kickoff(inputs)

        Age=gender_task.output.raw if gender_task.output else "No gender output"
        Category_array=category_task.output.raw if category_task.output else "No Category Output"
        

        # Return the result as JSON response
        return jsonify({"Age": Age,"Category":eval(Category_array)})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Run Flask app
if __name__ == '__main__':
    app.run(debug=False,port=5001)

