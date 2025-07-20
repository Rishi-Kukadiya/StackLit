import { CheckCircle } from "lucide-react";

export default function SuccessPopup({ message, onClose }) {
  return (
    <div className="fixed bottom-6 right-6 z-50 animate-fadeInUp">
      <div className="bg-green-500/20 backdrop-blur-md border border-green-400 shadow-2xl rounded-xl p-5 flex items-center gap-4 max-w-md transition-all duration-300">
        <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
        <div className="flex-1">
          <p className="text-white text-base font-medium">{message}</p>
        </div>
        <button
          onClick={onClose}
          className="bg-green-500/20 hover:bg-green-500/40 text-green-500 hover:text-white rounded-full p-2 transition-colors duration-200"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
