
document.addEventListener("DOMContentLoaded", function() {
    const html5QrCode = new Html5Qrcode("reader");

    document.getElementById("start-scan").addEventListener("click", function() {
        html5QrCode.start(
            { facingMode: "environment" }, // camera settings
            {
                fps: 10,    // frames per second
                qrbox: { width: 250, height: 250 }  // scanning box size
            },
            qrCodeMessage => {
                document.getElementById("result").innerText = `QR Code detected: ${qrCodeMessage}`;
            },
            errorMessage => {
                // Handle scanning errors
                console.warn(`QR Code no longer in front of camera: ${errorMessage}`);
            })
        .catch(err => {
            // Start failed, handle it.
            console.error(`Unable to start scanning, error: ${err}`);
        });
    });

    document.getElementById("stop-scan").addEventListener("click", function() {
        html5QrCode.stop()
            .then(ignore => {
                // QR Code scanning is stopped.
                document.getElementById("result").innerText = "Scanning stopped.";
            })
            .catch(err => {
                // Stop failed, handle it.
                console.error(`Unable to stop scanning, error: ${err}`);
            });
    });

    document.getElementById("file-upload").addEventListener("change", function(event) {
        const file = event.target.files[0];
        if (file) {
            html5QrCode.scanFile(file, true)
                .then(qrCodeMessage => {
                    document.getElementById("result").innerText = `QR Code detected: ${qrCodeMessage}`;
                })
                .catch(err => {
                    console.error(`Unable to scan file, error: ${err}`);
                });
        }
    });
});




// 
document.addEventListener("DOMContentLoaded", function() {
    const html5QrCode = new Html5Qrcode("reader");
    let cameras = [];
    
    // Fetch available cameras
    Html5Qrcode.getCameras().then(devices => {
        cameras = devices;

        if (cameras.length > 0) {
            populateCameraDropdown(cameras);
            // Start with the first camera
            startCamera(cameras[0].id);
        }
    }).catch(err => {
        console.error("Error getting cameras:", err);
    });

    // Populate dropdown with camera options
    function populateCameraDropdown(cameras) {
        const dropdown = document.getElementById("cameraDropdown");

        cameras.forEach(camera => {
            const option = document.createElement("option");
            option.value = camera.id;
            option.text = camera.label || `Camera ${camera.id}`;
            dropdown.appendChild(option);
        });

        dropdown.addEventListener("change", function() {
            html5QrCode.stop().then(() => {
                startCamera(this.value);
            }).catch(err => {
                console.error("Error stopping camera:", err);
            });
        });
    }

    // Start the selected camera
    function startCamera(cameraId) {
        html5QrCode.start(
            cameraId,
            { fps: 10, qrbox: { width: 250, height: 250 } },
            qrCodeMessage => {
                document.getElementById("result").innerText = `QR Code detected: ${qrCodeMessage}`;
            },
            errorMessage => {
                console.warn(`QR Code no longer in front of camera: ${errorMessage}`);
            }
        ).catch(err => {
            console.error("Error starting camera:", err);
        });
    }
});


// 
