const fileInput = document.querySelector(".file-input"),
filterOptions = document.querySelectorAll(".filter button"),
filterName = document.querySelector(".filter-info .name"),
filterValue = document.querySelector(".filter-info .value"),
filterSlider = document.querySelector(".slider input"),
rotateOptions = document.querySelectorAll(".rotate button"),
previewImg = document.querySelector(".preview-img img"),
resetFilterBtn = document.querySelector(".reset-filter"),
chooseImgBtn = document.querySelector(".choose-img"),
saveImgBtn = document.querySelector(".save-img");
saveCrop = document.querySelector(".save-crop");

let brightness = "100", saturation = "100", inversion = "0", grayscale = "0";
let rotate = 0, flipHorizontal = 1, flipVertical = 1;

const loadImage = () => {
    let file = fileInput.files[0];
    if(!file) return;
    previewImg.src = URL.createObjectURL(file);
    previewImg.addEventListener("load", () => {
        resetFilterBtn.click();
        document.querySelector(".container").classList.remove("disable");
    });
}

const applyFilter = () => {
    previewImg.style.transform = `rotate(${rotate}deg) scale(${flipHorizontal}, ${flipVertical})`;
    previewImg.style.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)`;
}

filterOptions.forEach(option => {
    option.addEventListener("click", () => {
        document.querySelector(".active").classList.remove("active");
        option.classList.add("active");
        filterName.innerText = option.innerText;

        if(option.id === "brightness") {
            filterSlider.max = "200";
            filterSlider.value = brightness;
            filterValue.innerText = `${brightness}%`;
        } else if(option.id === "saturation") {
            filterSlider.max = "200";
            filterSlider.value = saturation;
            filterValue.innerText = `${saturation}%`
        } else if(option.id === "inversion") {
            filterSlider.max = "100";
            filterSlider.value = inversion;
            filterValue.innerText = `${inversion}%`;
        } else {
            filterSlider.max = "100";
            filterSlider.value = grayscale;
            filterValue.innerText = `${grayscale}%`;
        }
    });
});

const updateFilter = () => {
    filterValue.innerText = `${filterSlider.value}%`;
    const selectedFilter = document.querySelector(".filter .active");

    if(selectedFilter.id === "brightness") {
        brightness = filterSlider.value;
    } else if(selectedFilter.id === "saturation") {
        saturation = filterSlider.value;
    } else if(selectedFilter.id === "inversion") {
        inversion = filterSlider.value;
    } else {
        grayscale = filterSlider.value;
    }
    applyFilter();
}

rotateOptions.forEach(option => {
    option.addEventListener("click", () => {
        if(option.id === "left") {
            rotate -= 90;
        } else if(option.id === "right") {
            rotate += 90;
        } else if(option.id === "horizontal") {
            flipHorizontal = flipHorizontal === 1 ? -1 : 1;
        } else {
            flipVertical = flipVertical === 1 ? -1 : 1;
        }
        applyFilter();
    });
});

const resetFilter = () => {
    brightness = "100"; saturation = "100"; inversion = "0"; grayscale = "0";
    rotate = 0; flipHorizontal = 1; flipVertical = 1;
    filterOptions[0].click();
    applyFilter();
}

const saveImage = () => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = previewImg.naturalWidth;
    canvas.height = previewImg.naturalHeight;
    
    ctx.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)`;
    ctx.translate(canvas.width / 2, canvas.height / 2);
    if(rotate !== 0) {
        ctx.rotate(rotate * Math.PI / 180);
    }
    ctx.scale(flipHorizontal, flipVertical);
    ctx.drawImage(previewImg, -canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);
    
    const link = document.createElement("a");
    link.download = "image.jpg";
    link.href = canvas.toDataURL();
    link.click();
}


filterSlider.addEventListener("input", updateFilter);
resetFilterBtn.addEventListener("click", resetFilter);
saveImgBtn.addEventListener("click", saveImage);
fileInput.addEventListener("change", loadImage);
chooseImgBtn.addEventListener("click", () => fileInput.click());


// // Crop Funtion
// // Inside the cropImage function
// const cropImage = () => {
//   if (!isCropping) {
//       isCropping = true;
//       previewImg.style.cursor = 'crosshair'; // Change cursor to indicate cropping mode
      
//       // Create and append a grid overlay div
//       const gridOverlay = document.createElement('div');
//       gridOverlay.className = 'grid-overlay';
//       previewImg.parentNode.appendChild(gridOverlay);
      
//       let startX, startY, endX, endY;
      
//       // Mouse down event listener to start selecting cropping area
//       previewImg.addEventListener('mousedown', (event) => {
//           startX = event.clientX;
//           startY = event.clientY;
          
//           // Mouse move event listener to update the cropping area as the user drags the mouse
//           const mouseMoveListener = (moveEvent) => {
//               endX = moveEvent.clientX;
//               endY = moveEvent.clientY;
              
//               // Update the size and position of the grid overlay
//               gridOverlay.style.left = Math.min(startX, endX) + 'px';
//               gridOverlay.style.top = Math.min(startY, endY) + 'px';
//               gridOverlay.style.width = Math.abs(endX - startX) + 'px';
//               gridOverlay.style.height = Math.abs(endY - startY) + 'px';
//           };
          
//           // Mouse up event listener to finalize the cropping area selection
//           const mouseUpListener = () => {
//               // Remove the mouse move and mouse up event listeners
//               document.removeEventListener('mousemove', mouseMoveListener);
//               document.removeEventListener('mouseup', mouseUpListener);
              
//               // Remove the grid overlay
//               gridOverlay.parentNode.removeChild(gridOverlay);
              
//               // Calculate the cropping area and perform cropping
//               const cropArea = {
//                   x: Math.min(startX, endX),
//                   y: Math.min(startY, endY),
//                   width: Math.abs(endX - startX),
//                   height: Math.abs(endY - startY)
//               };
//               performCrop(cropArea);
              
//               isCropping = false;
//               previewImg.style.cursor = 'auto'; // Revert cursor to default
//           };
          
//           // Add mouse move and mouse up event listeners
//           document.addEventListener('mousemove', mouseMoveListener);
//           document.addEventListener('mouseup', mouseUpListener);
//       });
//   }
// }

// // Function to perform the actual cropping based on the selected area
// const performCrop = (cropArea) => {
//   // Create a canvas for cropping
//   const canvas = document.createElement('canvas');
//   const ctx = canvas.getContext('2d');
  
//   // Set canvas size equal to the cropping area size
//   canvas.width = cropArea.width;
//   canvas.height = cropArea.height;
  
//   // Draw the cropped portion of the image onto the canvas
//   ctx.drawImage(previewImg, cropArea.x, cropArea.y, cropArea.width, cropArea.height, 0, 0, cropArea.width, cropArea.height);
  
//   // Replace the preview image with the cropped image
//   const croppedImage = new Image();
//   croppedImage.src = canvas.toDataURL();
//   previewImg.parentNode.replaceChild(croppedImage, previewImg);
//   previewImg = croppedImage; // Update the previewImg reference
// };

// crop
    var cropper;
    var croppedCanvas;
    var customDesigns = [];

    document.getElementById('fileInput').addEventListener('change', function (event) {
        var file = event.target.files[0];
        var reader = new FileReader();
        reader.onload = function (event) {
            var image = document.getElementById('image');
            image.src = event.target.result;
            document.getElementById('preview-img').style.display = 'block';
            document.getElementById('cropButton').style.display = 'block';
            cropper = new cropper(image, {
                aspectRatio: NaN, // Free cropping (no fixed aspect ratio)
                viewMode: 1,
                autoCropArea: 0.5,
                cropBoxResizable: false,
                zoomable: false
            });
        };
        reader.readAsDataURL(file);
    });

    function cropImage() {
        croppedCanvas = cropper.getCroppedCanvas();
        if (!croppedCanvas) {
            return;
        }
        // Get cropped image as a blob
        croppedCanvas.toBlob(function (blob) {
            // Do something with the cropped blob
            // For example, you can send it to a server via AJAX
            var croppedImage = document.createElement('img');
            croppedImage.src = URL.createObjectURL(blob);
            croppedImage.id = 'preview';
            document.body.appendChild(croppedImage);
            // Hide original image and crop button
            document.getElementById('preview-img').style.display = 'none';
            document.getElementById('saveCrop').style.display = 'none';
            // Show final and upload buttons
        });
    }