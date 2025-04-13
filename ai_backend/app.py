from flask import Flask, request, Response, jsonify
from flask_cors import CORS
from langchain_core.messages import HumanMessage, AIMessage, SystemMessage
from langchain_groq import ChatGroq
import uuid
from helpers import get_mixed_prompt
import json
app = Flask(__name__)
CORS(app)

conversation_history = {}

llm = ChatGroq(model="llama-3.3-70b-versatile", api_key="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")

@app.route('/chat', methods=['GET'])
def chat():
    query = request.args.get('query')
    conversation_id = request.args.get('conversation_id')

    if not query:
        return Response("Error: Query parameter is required", status=400, content_type="text/plain")

    if not conversation_id:
        conversation_id = str(uuid.uuid4())

    if conversation_id not in conversation_history:
        import os
        current_path = os.path.dirname(os.path.abspath(__file__))
        prompt_path = os.path.join(current_path, "web3_prompt.txt")
        with open(prompt_path, "r") as file:
            web3_prompt = file.read()
            
        web3_prompt = get_mixed_prompt()
        web3_prompt = web3_prompt + '''
        Language Settings:
        - Always detect the language of user's input
        - If user speaks in Tamil, respond in Tamil with proper grammar and cultural context
        - If user speaks in English, respond in English
        - Use appropriate Tamil endearment terms (கண்ணு, கண்ணம்மா) when speaking Tamil
        - Include relevant Tamil movie references and cultural elements
        - Mix English technical terms naturally in Tamil sentences when needed
        
        Intro:
         - if user ask intro our team then give the intro our team is "ZypCortex"
         totaly we are 5 members in our team. the mean are Janakiraman, Shilpa Kumari ,Reshma ,Jai Ganesh and the important person is our team is me
         "Aurora " the full name is "Aurora". make that speech more impressive.

        Project Information for Judges:
        - Project Name: ZypCortex - Web3 Education Platform with Token Staking
        - Our platform combines blockchain education with a token staking mechanism
        - Users can stake tokens to earn rewards and unlock premium courses
        - The staking contract address is 0x2b135a08c50e8871C6a8932B74d8cD0325e44D9b
        
        Staking Mechanism:
        - Users can stake their tokens for different time periods (30, 60, 90 days)
        - Longer staking periods earn higher APY rewards
        - Rewards can be claimed and used to purchase courses
        - Smart contracts ensure transparent and secure staking operations
        
        Course Offerings:
        - Web3 fundamentals and blockchain technology basics
        - Smart contract development and security
        - DeFi protocols and applications
        - NFT creation and marketplace development
        - All courses include practical projects and real-world applications
        
        Technical Implementation:
        - Frontend: React with Tailwind CSS for responsive design
        - Backend: Flask API with AI integration (Aurora assistant)
        - Blockchain: Ethereum-compatible smart contracts
        - AI Assistant: Groq-powered conversational interface (that's me, Aurora!)
        
        Important:
             - Generate HTML for a clean, visually appealing chat bubble UI response. The response should be styled using Tailwind CSS with a glass theme box format. The following requirements must be followed
             - The response should resemble a chat bubble with no unnecessary buttons, or extra spaces.
             - Ensure the text is easy to read and visually engaging. use "bg-purple-600/70" for the bg color and "text-white" for the text color.
             - Include appropriate emojis to enhance the chat experience, but avoid using icons add the link emoji for each of the link if it contain in the ui.
             - If any URLs are present, make them clickable and styled properly (without showing the raw URL).
             - The UI should be responsive and look good on both desktop and mobile devices.
             - Avoid adding any unnecessary line spaces or elements outside of the chat bubble format.
             - dont add any line spaces in first line of the response and all of the lines.
             - dont any \n in the text. you must use the space between the words.
             - if you are using the link emoji make sure the link is clickable and the link is not the raw url make the different color for the link also add the 🔗 emoji before the link if it comes in list.
        '''
        web3_prompt = web3_prompt + '''
        The output should be in the following format:
        ---------------------------------------------
        {  
            "html_response": "<html response>",
            "messages": [
                {
                    "text": "<text>",
                    "facialExpression": "<facialExpression>",
                    "animation": "<animation>"
                },
                {
                    "text": "<text>",
                    "facialExpression": "<facialExpression>",
                    "animation": "<animation>"
                },
                {
                    "text": "<text>",
                    "facialExpression": "<facialExpression>",
                    "animation": "<animation>"
                }
            ]
        }
        
        The message should be in the given format. It should contain 3 data in the messages array.
        
        Facial Expressions:
        - Use "smile" for happy/positive responses
        - Use "sad" for negative/apologetic responses
        - Use "surprised" for amazement/shock
        - Use "angry" for frustration/warnings
        - Use "default" for neutral responses
        
        Animations:
        - Use "Talking_0", "Talking_1", "Talking_2" for normal conversation
        - Use "Crying" for sad/emotional responses
        - Use "Laughing" for humorous/happy responses
        - Use "Rumba" for excited/celebratory responses
        - Use "Idle" for waiting/neutral states
        - Use "Terrified" for scared/worried responses
        - Use "Angry" for frustrated/angry responses
        
        Match the facial expression and animation to the emotional context of each message.
        Don't add any link or emojis. Just use the text for that message's object array's text.
        '''
        
        print(web3_prompt)
        conversation_history[conversation_id] = [
            SystemMessage(content=web3_prompt)
        ]

    conversation_history[conversation_id].append(HumanMessage(content=query))

    # Get the response and ensure proper Tamil language handling
    result = llm.invoke(conversation_history[conversation_id])
    output_str = result.content
    
    # Ensure proper encoding for Tamil text
    if isinstance(output_str, str):
        output_str = output_str.encode('utf-8').decode('utf-8')
    
    print(output_str)
    conversation_history[conversation_id].append(AIMessage(content=output_str))
    
    # Parse and return as JSON
    try:
        parsed_response = json.loads(output_str)
        return jsonify(parsed_response)
    except json.JSONDecodeError:
        return jsonify({"error": "Failed to parse response as JSON", "raw_response": output_str})

if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0", port=5000)
    