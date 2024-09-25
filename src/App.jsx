import React, { useState, useEffect } from "react";
import { FaMicrophone, FaVolumeMute, FaVolumeUp } from "react-icons/fa";

const App = () => {
    let messages = [
        { id: 1, text: "Hai, Gua metahuman dari Insignia, boleh, ada yang mau lu tanyain tentang gua ?", sender: "other" },
        { id: 2, text: "Hai, Gua metahuman dari Insignia, boleh, ada yang mau lu tanyain tentang gua ?", sender: "user" },
        { id: 3, text: "Hai, Gua metahuman dari Insignia, boleh, ada yang mau lu tanyain tentang gua ?", sender: "other" },
        { id: 4, text: "Hai, Gua metahuman dari Insignia, boleh, ada yang mau lu tanyain tentang gua ?", sender: "user" },
        { id: 5, text: "Hai, Gua metahuman dari Insignia, boleh, ada yang mau lu tanyain tentang gua ?", sender: "other" },
        { id: 6, text: "Hai, Gua metahuman dari Insignia, boleh, ada yang mau lu tanyain tentang gua ?", sender: "user" },
        { id: 7, text: "Hai, Gua metahuman dari Insignia, boleh, ada yang mau lu tanyain tentang gua ?", sender: "other" },
        { id: 8, text: "Hai, Gua metahuman dari Insignia, boleh, ada yang mau lu tanyain tentang gua ?", sender: "user" },
    ];

    let average = 0

    const [isSpeakerActive, setIsSpeakerActive] = useState(true);
    const [isMicActive, setIsMicActive] = useState(true);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [audioStream, setAudioStream] = useState(null);

    const startListening = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        setAudioStream(stream);

        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const analyser = audioContext.createAnalyser();
        const source = audioContext.createMediaStreamSource(stream);
        source.connect(analyser);
        analyser.fftSize = 2048;

        const dataArray = new Uint8Array(analyser.frequencyBinCount);

        const detectSound = () => {
            analyser.getByteFrequencyData(dataArray);
            const sum = dataArray.reduce((a, b) => a + b, 0);
            average = sum / dataArray.length;
            setIsSpeaking(average > 20);

            requestAnimationFrame(detectSound);
        };

        detectSound();
    };

    // Start listening effect
    useEffect(() => {
        if (isMicActive) {
            startListening();
        } else {
            // Stop the audio stream when mic is inactive
            if (audioStream) {
                audioStream.getTracks().forEach((track) => track.stop());
            }
        }
    }, [isMicActive]);

    const toggleSpeaker = () => {
        setIsSpeakerActive((prev) => {
            // If turning off speaker, mute the audio context
            if (prev) {
                const audioContext = new (window.AudioContext || window.webkitAudioContext)();
                audioContext.suspend();
            } else {
                const audioContext = new (window.AudioContext || window.webkitAudioContext)();
                audioContext.resume();
            }
            return !prev;
        });
    };

    return (
        <div className="w-full h-[100vh] flex">
            <div className="w-2/3 h-full p-20">
                {/* Logo */}
                <div className="mb-8">
                    <img src="/logo.png" alt="Insignia Logo" className="h-40" />
                </div>
                <div>
                    <div className="flex flex-col h-[70vh]">
                        {/* Chat container */}
                        <div className="relative">
                            <div className="bg-gradient-to-b from-white/80 to-white/80 h-10 w-full backdrop-blur-xl absolute"></div>
                        </div>
                        <div className="flex-grow p-4 overflow-y-auto flex flex-col-reverse pt-10">
                            <div className="space-y-4">
                                {messages.map((message) => (
                                    <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
                                        {message.sender !== "user" && (
                                            <img src="/hero.png" alt={message.name} className="w-10 h-10 rounded-full mr-2 bg-blue-500" />
                                        )}
                                        <div>
                                            <h4>
                                                {message.sender !== "user" && (
                                                    <div className="font-semibold text-[#0D082C]">Metahuman</div>
                                                )}
                                            </h4>
                                            <div className={`rounded-lg p-3 ${message.sender === "user" ? "bg-[#292A71] text-white" : "bg-[#F1F7FF] text-black"} max-w-xs`}>
                                                <div>{message.text}</div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="p-4 bg-white border-t border-gray-300">
                            <div className="flex items-center">
                                {/* Speaker Icon */}
                                <button
                                    onClick={toggleSpeaker} // Toggle speaker
                                    className="p-2 rounded-full hover:bg-gray-200"
                                >
                                    {isSpeakerActive ? (
                                        <FaVolumeUp size={30} color="#292A71" />
                                    ) : (
                                        <FaVolumeMute size={30} color="gray" />
                                    )}
                                </button>
                                {/* Microphone Icon */}
                                <button
                                    onClick={() => setIsMicActive((prev) => !prev)} // Toggle microphone
                                    className="p-2 rounded-full hover:bg-gray-200"
                                >
                                    <FaMicrophone size={30} color={isMicActive ? "#292A71" : "gray"} />
                                </button>
                                {/* Sound Wave Animation */}
                                {isMicActive && (
                                    <div className={`ml-6 pl-2 h-2 bg-blue-500 transition-all duration-300 ${isSpeaking ? "w-full" : "w-0"}`}></div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="w-full h-full">
                {/* Hero */}
                <img
                    src="/hero.png"
                    alt="Metahuman"
                    className="w-full h-full"
                />
            </div>
        </div>
    );
};

export default App;
