import { useEffect, useState, useRef } from 'react';
import JSConfetti from 'js-confetti';

import './App.scss'

const jsConfetti = new JSConfetti()

function App() {

  const [action, setAction] = useState("apagado");
  const [dec, setDeci] = useState(0);

  const audioRef = useRef(null);


  useEffect(() => {

    const decibelMeter = document.getElementById('decibel-meter');
    const decibelValue = document.getElementById('decibel-value');

    // Establecer umbral para detener la escucha
    const umbralDetenerEscucha = 80;

    // Verificar compatibilidad con la API Web Audio
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      // Configurar el contexto de audio
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const analyser = audioContext.createAnalyser();

      // Configurar el nodo de entrada del micrófono
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then((stream) => {
          const microphone = audioContext.createMediaStreamSource(stream);
          microphone.connect(analyser);

          // Configurar la analización de audio
          analyser.fftSize = 256;
          const bufferLength = analyser.frequencyBinCount;
          const dataArray = new Uint8Array(bufferLength);

          // Función para actualizar la visualización
          function updateDecibelValue() {

            analyser.getByteFrequencyData(dataArray);

            // Calcular el nivel de sonido promedio
            let sum = 0;
            for (let i = 0; i < bufferLength; i++) {
              // Normalizar valores si están en el rango 0-255
              const normalizedValue = dataArray[i] / 255;
              sum += normalizedValue;
            }
            const average = sum / bufferLength;

            // Convertir el nivel de sonido a decibelios
            const dB = umbralDetenerEscucha * Math.log10(average || 0.001);  // Evitar logaritmo de 0

            // Actualizar la visualización
            decibelValue.textContent = dB.toFixed(2);

            setDeci(dB)
            // Verificar si se supera el umbral para detener la escucha
            const positiveDb = (dB > 0 ? dB : dB * -1).toFixed(0);

            if (positiveDb < 50) {
              decibelMeter.textContent = 'NAADDA', positiveDb;
              setAction("nada")
            }

            if (positiveDb < 40 && positiveDb > 30) {
              decibelMeter.textContent = 'Soplando...', positiveDb;
              setAction("soplando")
            }

            if (positiveDb < 29) {
              decibelMeter.textContent = 'APAGADO', positiveDb;
              setAction("apagado");


              // TODO: customize emojis to show
              return jsConfetti.addConfetti({
                // emojis: ['😿'],
                confettiNumber: 250,
                emojiSize: 100,
              });
            }


            requestAnimationFrame(updateDecibelValue);

          }

          // Iniciar la actualización continua
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
    setAction("nada")
    // audioRef.current.src = "/songs/feliz-cumpleanos-feliz-.mp3"
    // audio.play();
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
      <button
        className="startButton"
        onClick={handleStart}
      >
        Iniciar
      </button>

    </>
  )
}

export default App