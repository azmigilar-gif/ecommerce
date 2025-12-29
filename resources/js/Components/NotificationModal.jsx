import React, { useState } from "react";

export default function NotificationModal({
    message,
    type = "success",
    onClose,
}) {
    const [isVisible, setIsVisible] = useState(true);

    const handleClose = () => {
        setIsVisible(false);
        if (onClose) onClose();
    };

    if (!isVisible || !message) return null;

    const isSuccess = type === "success";

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
            <div
                className={`
                    relative w-80 p-8 rounded-2xl shadow-2xl
                    animate-in fade-in scale-in duration-300
                    ${
                        isSuccess
                            ? "bg-gradient-to-br from-green-50 to-green-100"
                            : "bg-gradient-to-br from-red-50 to-red-100"
                    }
                    pointer-events-auto
                `}
            >
                {/* Animated Checkmark or Error Icon */}
                <div className="flex justify-center mb-4">
                    {isSuccess ? (
                        <div className="relative w-20 h-20">
                            {/* Circle background */}
                            <div
                                className="absolute inset-0 bg-green-500 rounded-full animate-pulse"
                                style={{
                                    animation: "scaleIn 0.6s ease-out",
                                }}
                            />

                            {/* Checkmark */}
                            <svg
                                className="relative w-20 h-20 text-white"
                                style={{
                                    animation:
                                        "checkmarkDraw 0.8s ease-out 0.3s both",
                                }}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 13l4 4L19 7"
                                />
                            </svg>

                            <style>{`
                                @keyframes scaleIn {
                                    from {
                                        transform: scale(0);
                                        opacity: 0;
                                    }
                                    to {
                                        transform: scale(1);
                                        opacity: 1;
                                    }
                                }

                                @keyframes checkmarkDraw {
                                    from {
                                        stroke-dasharray: 70;
                                        stroke-dashoffset: 70;
                                    }
                                    to {
                                        stroke-dasharray: 70;
                                        stroke-dashoffset: 0;
                                    }
                                }
                            `}</style>
                        </div>
                    ) : (
                        <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center animate-bounce">
                            <svg
                                className="w-12 h-12 text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </div>
                    )}
                </div>

                {/* Message */}
                <div className="text-center mb-6">
                    <p
                        className={`
                            text-lg font-semibold
                            ${isSuccess ? "text-green-800" : "text-red-800"}
                        `}
                    >
                        {isSuccess ? "Success!" : "Error!"}
                    </p>
                    <p
                        className={`
                            text-sm mt-2
                            ${isSuccess ? "text-green-700" : "text-red-700"}
                        `}
                    >
                        {message}
                    </p>
                </div>

                {/* OK Button - Full Width */}
                <button
                    onClick={handleClose}
                    className={`
                        w-full py-3 rounded-lg font-semibold text-white
                        transition duration-200
                        ${
                            isSuccess
                                ? "bg-green-500 hover:bg-green-600 active:scale-95"
                                : "bg-red-500 hover:bg-red-600 active:scale-95"
                        }
                    `}
                >
                    OK
                </button>
            </div>
        </div>
    );
}
