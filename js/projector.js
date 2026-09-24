/* AISC Phone Projector Prototype 1
   Phone-only experiment using the camera and, where supported, camera torch.
   This prototype tests the device capabilities; it does not claim optical
   projection without suitable physical optics. */
(function () {
  "use strict";

  let stream = null;
  let track = null;
  let torchOn = false;

  function $(id) {
    return document.getElementById(id);
  }

  function setStatus(message, error) {
    const status = $("aiscProjectorStatus");
    if (status) status.textContent = message;
    const errorBox = $("aiscProjectorError");
    if (errorBox) {
      errorBox.textContent = error || "";
      errorBox.hidden = !error;
    }
  }

  async function startCamera() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setStatus("Camera API unavailable", "This browser does not provide camera access.");
      return;
    }

    try {
      setStatus("Requesting camera…");
      stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: "environment" },
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        },
        audio: false
      });

      const video = $("aiscProjectorCamera");
      video.srcObject = stream;
      await video.play();

      track = stream.getVideoTracks()[0];
      const capabilities = track.getCapabilities ? track.getCapabilities() : {};
      const hasTorch = !!capabilities.torch;

      if (hasTorch) {
        setStatus("Camera ready • Torch supported");
        $("aiscTorchButton").disabled = false;
      } else {
        setStatus("Camera ready • Torch not exposed by browser");
        $("aiscTorchButton").disabled = true;
      }
    } catch (error) {
      console.error(error);
      setStatus("Camera permission needed", "Allow camera access, then press Start Camera again.");
    }
  }

  async function toggleTorch() {
    if (!track) return;

    try {
      const capabilities = track.getCapabilities ? track.getCapabilities() : {};
      if (!capabilities.torch) {
        setStatus("Torch unavailable", "This phone/browser does not expose torch control to the web app.");
        return;
      }

      torchOn = !torchOn;
      await track.applyConstraints({ advanced: [{ torch: torchOn }] });
      setStatus(torchOn ? "Camera ready • Torch ON" : "Camera ready • Torch OFF");
      $("aiscTorchButton").textContent = torchOn ? "Turn Torch Off" : "Turn Torch On";
    } catch (error) {
      console.error(error);
      setStatus("Torch test failed", "The browser refused torch control on this device.");
      torchOn = false;
    }
  }

  async function enterFullscreen() {
    const root = $("aiscProjector");
    try {
      if (!document.fullscreenElement && root.requestFullscreen) {
        await root.requestFullscreen();
      }
    } catch (error) {
      console.warn("Fullscreen was not available.", error);
    }
  }

  function stopCamera() {
    if (track && torchOn) {
      track.applyConstraints({ advanced: [{ torch: false }] }).catch(function () {});
    }
    if (stream) {
      stream.getTracks().forEach(function (item) { item.stop(); });
    }
    stream = null;
    track = null;
    torchOn = false;
  }

  function buildProjector() {
    if (document.getElementById("aiscProjector")) return;

    const root = document.createElement("section");
    root.id = "aiscProjector";
    root.setAttribute("aria-label", "AISC Phone Projector Prototype");
    root.innerHTML = `
      <div class="aisc-projector-top">
        <div class="aisc-projector-brand">AI International School</div>
        <div class="aisc-projector-status" id="aiscProjectorStatus">Starting projector…</div>
      </div>

      <div class="aisc-projector-stage">
        <video id="aiscProjectorCamera" autoplay playsinline muted aria-label="Camera view"></video>
        <div class="aisc-projector-grid"></div>
        <div class="aisc-projector-test-card">
          <div class="test-label">Phone Projector Prototype 1</div>
          <h1>AISC</h1>
          <p>Phone → Camera + Torch → Projection Test</p>
          <div class="aisc-projector-error" id="aiscProjectorError" hidden></div>
        </div>
      </div>

      <div class="aisc-projector-bottom">
        <button class="aisc-projector-button primary" id="aiscStartCamera" type="button">Start Camera</button>
        <button class="aisc-projector-button" id="aiscTorchButton" type="button" disabled>Turn Torch On</button>
        <button class="aisc-projector-button" id="aiscFullscreenButton" type="button">Full Screen</button>
        <div class="aisc-projector-help">Prototype test only • camera/torch support depends on the phone and browser.</div>
      </div>
    `;

    document.body.appendChild(root);

    $("aiscStartCamera").addEventListener("click", startCamera);
    $("aiscTorchButton").addEventListener("click", toggleTorch);
    $("aiscFullscreenButton").addEventListener("click", enterFullscreen);

    window.addEventListener("beforeunload", stopCamera);
    startCamera();
  }

  document.addEventListener("DOMContentLoaded", function () {
    buildProjector();
  });
})();
