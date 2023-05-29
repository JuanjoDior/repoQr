document.addEventListener("DOMContentLoaded", function(event) {
    var video = document.getElementById("qr-video");
    var canvasElement = document.getElementById("qr-canvas");
    var canvas = canvasElement.getContext("2d");
    var output = document.getElementById("output");
  
    var constraints = {
      audio: false,
      video: {
        facingMode: "environment"
      }
    };
  
    function handleSuccess(stream) {
      window.stream = stream;
      video.srcObject = stream;
      video.play();
      requestAnimationFrame(tick);
    }
  
    function handleError(error) {
      console.error("Error al acceder a la cámara: ", error);
    }
  
    function tick() {
      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        canvasElement.height = video.videoHeight;
        canvasElement.width = video.videoWidth;
        canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);
        var imageData = canvas.getImageData(0, 0, canvasElement.width, canvasElement.height);
        var code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: "dontInvert"
        });
  
        if (code) {
          output.innerHTML = "Código QR detectado: " + code.data;
          // Aquí puedes agregar la lógica adicional que desees realizar con el código QR detectado
        }
      }
      requestAnimationFrame(tick);
    }
  
    navigator.mediaDevices.getUserMedia(constraints).then(handleSuccess).catch(handleError);
  });
  