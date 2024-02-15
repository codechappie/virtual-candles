import { useEffect, useState, useRef } from 'react';
import JSConfetti from 'js-confetti';
import { Button } from "@nextui-org/react";
import AppBar from './AppBar/AppBar';


const jsConfetti = new JSConfetti()



const MainView = () => {

    const [action, setAction] = useState("apagado");
    const [dec, setDeci] = useState(0);

    const [blowSensibility, setBlowSensibility] = useState(0);

    const audioRef = useRef(null);


    useEffect(() => {

        const decibelMeter = document.getElementById('decibel-meter');
        const decibelValue = document.getElementById('decibel-value');

        const maxBlowUmbral = 140 - (blowSensibility / 2);
        const minBlowUmbral = maxBlowUmbral / 2;

        // Set threshold to stop listening
        const stopListeningUmbral = 80;

        // Check compatibility with the Web Audio API
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            //  Set up the audio context
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const analyser = audioContext.createAnalyser();

            // Set up the microphone input node
            navigator.mediaDevices.getUserMedia({ audio: true })
                .then((stream) => {
                    const microphone = audioContext.createMediaStreamSource(stream);
                    microphone.connect(analyser);

                    // Set up audio analysis
                    analyser.fftSize = 256;

                    const bufferLength = analyser.frequencyBinCount;
                    const dataArray = new Uint8Array(bufferLength);

                    // Function to update the visualization
                    function updateDecibelValue() {

                        analyser.getByteFrequencyData(dataArray);

                        // Calculate the average sound level
                        let sum = 0;
                        for (let i = 0; i < bufferLength; i++) {
                            // Normalize values if they are in the range 0-255
                            const normalizedValue = dataArray[i] / 255;
                            sum += normalizedValue;
                        }
                        const average = sum / bufferLength;

                        // Convert the sound level to decibels
                        const dB = stopListeningUmbral * Math.log10(average || 0.001);  // Evitar logaritmo de 0

                        // Update the visualization
                        decibelValue.textContent = dB.toFixed(2);

                        setDeci(dB)
                        // Check if the threshold to stop listening is exceeded
                        const positiveDb = (dB > 0 ? dB : dB * -1).toFixed(0) * 1;

                        if (positiveDb > maxBlowUmbral) {
                            decibelMeter.textContent = 'NAADDA', positiveDb;
                            setAction("nada")
                        }

                        if (positiveDb < maxBlowUmbral && positiveDb > minBlowUmbral) {
                            decibelMeter.textContent = 'Soplando...', positiveDb;
                            setAction("soplando")
                        }

                        if (positiveDb < minBlowUmbral) {
                            decibelMeter.textContent = 'APAGADO', positiveDb;
                            setAction("apagado");


                            // TODO: customize emojis to show
                            return jsConfetti.addConfetti({
                                emojis: ['🎈', '🎉', '🥳'],
                                confettiNumber: 250,
                                emojiSize: 120,
                            });
                        }


                        requestAnimationFrame(updateDecibelValue);

                    }

                    // Start continuous updating
                    updateDecibelValue();
                })
                .catch(() => {
                    decibelMeter.textContent = 'Error al acceder al micrófono';
                });
        } else {
            decibelMeter.textContent = 'La API Web Audio no es compatible con este navegador.';
        }

    }, [action]);

    const handleStart = () => {
        window.location.reload();
        setAction("nada");
    }

    const playMusic = () => {
        audioRef.current.src = "/songs/feliz-cumpleanos-feliz-.mp3"
        audio.play();
    }

    return (
        <>

            <h1>{action}</h1>
            <div id="decibel-meter">Medidor de Decibelios: <span id="decibel-value">0</span> dB</div>
            <h3>{dec}</h3>
            <div className="center">
                <div className={`holder ${action}`}>
                    <div className="candle">
                        <div className="blinking-glow"></div>
                        <div className="thread"></div>
                        <div className="glow"></div>
                        <div className="flame"></div>
                    </div>
                </div>
            </div>
            <audio id="audio" ref={audioRef} autoPlay></audio>



            <AppBar handleStart={handleStart} />
        </>

    )
}

export default MainView