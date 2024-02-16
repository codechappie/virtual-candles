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

        const maxBlowUmbral = 140 - (100 * blowSensibility);
        const minBlowUmbral = maxBlowUmbral / 2;

        console.log(maxBlowUmbral)
        const stopListeningUmbral = 80;

        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const analyser = audioContext.createAnalyser();

            navigator.mediaDevices.getUserMedia({ audio: true })
                .then((stream) => {
                    const microphone = audioContext.createMediaStreamSource(stream);
                    microphone.connect(analyser);

                    analyser.fftSize = 256;

                    const bufferLength = analyser.frequencyBinCount;
                    const dataArray = new Uint8Array(bufferLength);

                    function updateDecibelValue() {

                        analyser.getByteFrequencyData(dataArray);

                        let sum = 0;
                        for (let i = 0; i < bufferLength; i++) {
                            const normalizedValue = dataArray[i] / 255;
                            sum += normalizedValue;
                        }
                        const average = sum / bufferLength;

                        const dB = stopListeningUmbral * Math.log10(average || 0.001);  // Evitar logaritmo de 0


                        setDeci(dB)

                        const positiveDb = (dB > 0 ? dB : dB * -1).toFixed(0) * 1;


                        // console.log(maxBlowUmbral, positiveDb)

                        if (positiveDb > maxBlowUmbral) {
                            setAction("nada")
                        }

                        if (positiveDb < maxBlowUmbral && positiveDb > minBlowUmbral) {
                            setAction("soplando")
                        }

                        if (positiveDb < minBlowUmbral) {
                            setAction("apagado");

                            // TODO: customize emojis to show
                            return jsConfetti.addConfetti({
                                emojis: ['🎈', '🎉', '🥳'],
                                confettiNumber: 50,
                                emojiSize: 50,
                            });
                        }

                        requestAnimationFrame(updateDecibelValue);
                    }

                    // Start continuous updating
                    updateDecibelValue();
                })
                .catch(() => {
                    console.log('Error al acceder al micrófono');
                });
        } else {
            console.log('La API Web Audio no es compatible con este navegador.')
        }

    }, [action]);

    useEffect(() => {
        setAction("nada");
    }, [blowSensibility]);

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

            <AppBar handleStart={handleStart} blowSensibility={blowSensibility} setBlowSensibility={setBlowSensibility} />
        </>

    )
}

export default MainView