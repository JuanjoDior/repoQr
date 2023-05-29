document.addEventListener("DOMContentLoaded", function(event) {
  const video = document.getElementById("video");
  const canvasElement = document.getElementById("canvas");
  const canvas = canvasElement.getContext("2d");
  const qrResult = document.getElementById("qr-result");

  function handleSuccess(stream) {
    video.srcObject = stream;
    video.play();
    requestAnimationFrame(tick);
  }

  function handleError(error) {
    console.error("Error al acceder a la cámara: ", error);
  }

  function tick() {
    if (video.readyState === video.HAVE_ENOUGH_DATA) {
      canvasElement.hidden = false;
      canvasElement.width = video.videoWidth;
      canvasElement.height = video.videoHeight;
      canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);
      const imageData = canvas.getImageData(0, 0, canvasElement.width, canvasElement.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: "dontInvert"
      });

      if (code) {
        qrResult.textContent = "Código QR detectado: " + code.data;
        // Aquí puedes agregar la lógica adicional que desees realizar con el código QR detectado
      } else {
        qrResult.textContent = "Escaneando...";
      }
    }
    requestAnimationFrame(tick);
  }

  navigator.mediaDevices.getUserMedia({ video: true }).then(handleSuccess).catch(handleError);
});
