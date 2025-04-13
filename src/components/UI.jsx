import { useRef, useState } from "react";
import { useChat } from "../hooks/useChat";
import { FaMicrophone } from "react-icons/fa";
import { IoSend } from "react-icons/io5";

export const UI = ({ hidden, ...props }) => {
  const input = useRef();
  const [isListening, setIsListening] = useState(false);
  const { chat, loading, cameraZoomed, setCameraZoomed, message } = useChat();

  const sendMessage = (text) => {
    if (!loading && !message && text && text.trim()) {
      chat(text);
      if (input.current) {
        input.current.value = "";
      }
    }
  };

  const startVoiceInput = () => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new window.webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        if (transcript && transcript.trim()) {
          if (input.current) {
            input.current.value = transcript;
          }
          // Wait 2 seconds before sending
          setTimeout(() => {
            sendMessage(transcript);
          }, 2000);
        }
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } else {
      alert('Speech recognition is not supported in this browser.');
    }
  };

  if (hidden) {
    return null;
  }

  return (
    <div className="overflow-hidden min-h-screen">
      <div className="fixed top-0 left-0 right-0 bottom-0 z-10 flex justify-between p-4 flex-col pointer-events-none">
        <div
          className="self-start backdrop-blur-md bg-white bg-opacity-50 p-3 sm:p-4 rounded-lg max-w-full sm:max-w-md"
          style={{ padding: '10px' }}
        >
          <h1
            className="font-bold text-lg sm:text-xl lg:text-2xl text-purple-800"
            style={{ fontSize: '90%' }}
          >
          Aurora - The Web3 AI Agent
          </h1>
          <p className="text-xs sm:text-sm lg:text-base">I Will Always Help You to Automate Every Single Web3 Flow </p>
        </div>
        <div className="w-full flex flex-col sm:flex-row items-end justify-center gap-4" style={{ display: 'grid', justifyItems: 'start', alignContent: 'stretch', justifyContent: 'end' }}>
          <button
            onClick={() => setCameraZoomed(!cameraZoomed)}
            className="pointer-events-auto bg-blue-200 hover:bg-blue-400 text-white p-3 sm:p-4 transition duration-200 group"
            id="btn"
          >
            {cameraZoomed ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="#333333"
                className="w-5 h-5 sm:w-6 sm:h-6 transition-colors duration-200 group-hover:stroke-white svg-path"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM13.5 10.5h-6"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="#333333"
                className="w-5 h-5 sm:w-6 sm:h-6 transition-colors duration-200 group-hover:stroke-white svg-path"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6"
                />
              </svg>
            )}
          </button>
          <button
            onClick={() => {
              const body = document.querySelector("body");
              body.classList.toggle("greenScreen");
            }}
            className="pointer-events-auto bg-purple-200 hover:bg-purple-400 text-white p-3 sm:p-4 rounded-xl transition duration-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="#000000"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5 sm:w-6 sm:h-6"
            >
              <path
                strokeLinecap="round"
                d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25-2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z"
              />
            </svg>
          </button>
          <button
            onClick={() => window.location.reload()}
            className="pointer-events-auto bg-blue-200 hover:bg-blue-400 text-white p-3 sm:p-4 transition duration-200 group"
            id="btn"
          >
            <svg
              className="w-5 h-5 sm:w-6 sm:h-6 transition-colors duration-200 group-hover:stroke-white"
              xmlns="http://www.w3.org/2000/svg"
              width="1em"
              height="1em"
              viewBox="0 0 24 24"
            >
              <g
                fill="none"
                className="svg-path"
                stroke="#333333"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              >
                <path d="M19.933 13.041a8 8 0 1 1-9.925-8.788c3.899-1 7.935 1.007 9.425 4.747" />
                <path d="M20 4v5h-5" />
              </g>
            </svg>
          </button>
          <style jsx>{`
            #btn:hover .svg-path {
              stroke: white;
            }
          `}</style>
        </div>
        {message && message.text && (
          <div className="self-center bg-gray-100 bg-opacity-75 p-3 sm:p-4 rounded-lg mt-10 sm:mt-20 inline-block w-fit">
            <p className="text-xs sm:text-sm lg:text-base text-gray-900">{message.text}</p>
          </div>
        )}
        <div className="flex items-center gap-2 pointer-events-auto max-w-screen-sm w-full mx-auto mt-4">
          <input
            className="w-full placeholder:text-gray-800 placeholder:italic p-3 sm:p-4 rounded-md bg-opacity-50 bg-white backdrop-blur-md text-xs sm:text-sm"
            placeholder="Type a message..."
            ref={input}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                sendMessage(e.target.value);
              }
            }}
          />
          <button
            onClick={() => startVoiceInput()}
            className={`bg-red-200 hover:bg-red-400 text-gray-800 hover:text-white p-2 sm:p-4 rounded-md transition duration-200 ${
              isListening ? "animate-pulse" : ""
            }`}
          >
            <FaMicrophone className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
          <button
            disabled={loading || message}
            onClick={() => sendMessage(input.current.value)}
            className={`bg-blue-200 hover:bg-blue-400 text-gray-800 hover:text-white p-2 sm:p-4 font-semibold uppercase rounded-md transition duration-200 flex items-center gap-2 ${
              loading || message ? "cursor-not-allowed opacity-50" : ""
            }`}
          >
            <IoSend className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
