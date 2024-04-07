// Get the source image to be edited
let image = document.getElementById('sourceImage');
 
// Get the canvas for the edited image
let canvas = document.getElementById('canvas');
 
// Get the 2D context of the image
let context = canvas.getContext('2d');

// Get all the sliders of the image
let brightnessSlider = document.getElementById("brightnessSlider");
let contrastSlider = document.getElementById("contrastSlider");
let grayscaleSlider = document.getElementById("grayscaleSlider");
let hueRotateSlider = document.getElementById("hueRotateSlider");
let saturateSlider = document.getElementById("saturationSlider");
let sepiaSlider = document.getElementById("sepiaSlider");


function uploadImage(event) {
 
    // Set the source of the image from the uploaded file
    image.src = URL.createObjectURL(event.target.files[0]);
 
    image.onload = function () {
        canvas.width = this.width;
        canvas.height = this.height;
        canvas.crossOrigin = "anonymous";
        applyFilter();
    };

    const save_reset = document.getElementById("save-reset");
    save_reset.classList.remove('hidden');

    document.querySelector('.help-text').style.display = "none";
    document.querySelector('.save-reset').style.display = "block";
    document.querySelector('.image-controls').style.display = "block";
    document.querySelector('.preset-filters').style.display = "block";
};


function applyFilter() {
//     let originalWidth = image.naturalWidth;
//   let originalHeight = image.naturalHeight;
//   let canvasWidth = canvas.width;
//   let canvasHeight = canvas.height;
//   let scalingFactor = Math.min(canvasWidth / originalWidth, canvasHeight / originalHeight);

    let filterString =
      "brightness(" + brightnessSlider.value + "%" +
      ") contrast(" + contrastSlider.value + "%" +
      ") grayscale(" + grayscaleSlider.value + "%" +
      ") saturate(" + saturateSlider.value + "%" +
      ") sepia(" + sepiaSlider.value + "%" +
      ") hue-rotate(" + hueRotateSlider.value + "deg" + ")";
  
      // Apply filter to the context
      context.filter = filterString;

      // Redraw the image with filter applied
      context.drawImage(image, 0, 0);
  }

// A series of functions that handle the preset filters
// Each of these will first reset the image
// and then apply a certain parameter before
// redrawing the image
function brightenFilter() {
    resetImage();
    brightnessSlider.value = 130;
    contrastSlider.value = 120;
    saturateSlider.value = 120;
    applyFilter();
}
 
function bwFilter() {
    resetImage();
    grayscaleSlider.value = 100;
    brightnessSlider.value = 120;
    contrastSlider.value = 120;
    applyFilter();
}
 
function funkyFilter() {
    resetImage();
 
    // Set a random hue rotation everytime
    hueRotateSlider.value =
     Math.floor(Math.random() * 360) + 1;
    contrastSlider.value = 120;
    applyFilter();
}
 
function vintageFilter() {
    resetImage();
    brightnessSlider.value = 120;
    saturateSlider.value = 120;
    sepiaSlider.value = 150;
    applyFilter();
}

// Reset all the slider values to there default values
function resetImage() {
    brightnessSlider.value = 100;
    contrastSlider.value = 100;
    grayscaleSlider.value = 0;
    hueRotateSlider.value = 0;
    saturateSlider.value = 100;
    sepiaSlider.value = 0;
    applyFilter();
}
 
function saveImage() {
    // Select the temporary element we have created for
    // helping to save the image
    let linkElement = document.getElementById('link');
    linkElement.setAttribute(
      'download', 'edited_image.png'
    );
 
    // Convert the canvas data to a image data URL
    let canvasData = canvas.toDataURL("image/png")
 
    // Replace it with a stream so that
    // it starts downloading
    canvasData.replace(
      "image/png", "image/octet-stream"
    )
 
    // Set the location href to the canvas data
    linkElement.setAttribute('href', canvasData);
 
    // Click on the link to start the download 
    linkElement.click();
}
