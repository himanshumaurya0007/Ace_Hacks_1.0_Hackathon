const fileInput = document.querySelector(".file-input"),
      filterOptions = document.querySelectorAll(".filter button"),
      filterName = document.querySelector(".filter-info .name"),
      filterValue = document.querySelector(".filter-info .value"),
      filterSlider = document.querySelector(".slider input"),
      rotateOptions = document.querySelectorAll(".rotate button"),
      previewImg = document.querySelector("#previewImg"),
      resetFilterBtn = document.querySelector(".reset-filter"),
      chooseImgBtn = document.querySelector(".choose-img"),
      saveImgBtn = document.querySelector(".save-img"),
      cropToggleBtn = document.querySelector(".crop-toggle"),
      cropGrid = document.querySelector(".crop-grid");

    let brightness = "100",
      saturation = "100",
      inversion = "0",
      grayscale = "0";
    let rotate = 0,
      flipHorizontal = 1,
      flipVertical = 1;
    let cropper; // Initialize Cropper object

    const loadImage = () => {
      let file = fileInput.files[0];
      if (!file) return;
      previewImg.src = URL.createObjectURL(file);
      previewImg.addEventListener("load", () => {
        resetFilterBtn.click();
        document.querySelector(".container").classList.remove("disable");

        // Initialize Cropper
        cropper = new Cropper(previewImg, {
          aspectRatio: NaN, // Set aspect ratio as you desire or keep it NaN for free selection
          viewMode: 1, // Set the view mode as you need
          crop(event) {
            // This function will be called when crop area is changed
            // You can get crop box data using: event.detail.width, event.detail.height, event.detail.x, event.detail.y
            // Example usage: console.log(event.detail.x, event.detail.y, event.detail.width, event.detail.height);
            // Display cropped image
            const croppedCanvas = cropper.getCroppedCanvas();
            if (croppedCanvas) {
              document.querySelector('.preview-img img').src = croppedCanvas.toDataURL();
            }
          },
        });

        // Disable the cropper by default
        if (cropper) {
          cropper.disable();
        }
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

        if (option.id === "brightness") {
          filterSlider.max = "200";
          filterSlider.value = brightness;
          filterValue.innerText = `${brightness}%`;
        } else if (option.id === "saturation") {
          filterSlider.max = "200";
          filterSlider.value = saturation;
          filterValue.innerText = `${saturation}%`
        } else if (option.id === "inversion") {
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

      if (selectedFilter.id === "brightness") {
        brightness = filterSlider.value;
      } else if (selectedFilter.id === "saturation") {
        saturation = filterSlider.value;
      } else if (selectedFilter.id === "inversion") {
        inversion = filterSlider.value;
      } else {
        grayscale = filterSlider.value;
      }
      applyFilter();
    }

    rotateOptions.forEach(option => {
      option.addEventListener("click", () => {
        if (option.id === "left") {
          rotate -= 90;
        } else if (option.id === "right") {
          rotate += 90;
        } else if (option.id === "horizontal") {
          flipHorizontal = flipHorizontal === 1 ? -1 : 1;
        } else {
          flipVertical = flipVertical === 1 ? -1 : 1;
        }
        applyFilter();
      });
    });

    const resetFilter = () => {
      brightness = "100";
      saturation = "100";
      inversion = "0";
      grayscale = "0";
      rotate = 0;
      flipHorizontal = 1;
      flipVertical = 1;
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
      if (rotate !== 0) {
        ctx.rotate(rotate * Math.PI / 180);
      }
      ctx.scale(flipHorizontal, flipVertical);
      ctx.drawImage(previewImg, -canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);

      const croppedImageData = canvas.toDataURL();
      const link = document.createElement("a");
      link.download = "cropped_image.jpg";
      link.href = croppedImageData;
      link.click();
    }

    filterSlider.addEventListener("input", updateFilter);
    resetFilterBtn.addEventListener("click", resetFilter);
    saveImgBtn.addEventListener("click", saveImage);
    fileInput.addEventListener("change", loadImage);
    chooseImgBtn.addEventListener("click", () => fileInput.click());

    // Toggle Crop Grid
    cropToggleBtn.addEventListener("click", () => {
      const displayMode = cropGrid.style.display === "none" ? "block" : "none";
      cropGrid.style.display = displayMode;
      // Enable or disable the cropper based on the crop grid visibility
      if (displayMode === "none") {
        if (cropper) {
          cropper.clear(); // Clear the crop area
          cropper.disable();
        }
      } else {
        if (cropper) {
          cropper.enable();
        }
      }
    });