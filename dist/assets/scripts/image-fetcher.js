"use strict";

document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('fetchButton').addEventListener('click', function () {
    var imageUrl = document.getElementById('urlInput').value;
    if (imageUrl.includes('[') && imageUrl.includes(']')) {
      handleImageSeries(imageUrl);
    } else if (validateUrl(imageUrl)) {
      fetchImage([imageUrl]);
    } else {
      displayError('Please enter a valid URL.');
    }
  });
  document.getElementById('list-view-toggle').addEventListener('click', function () {
    document.getElementById('imageDisplay').className = 'list-view';
  });
  document.getElementById('grid-view-toggle').addEventListener('click', function () {
    document.getElementById('imageDisplay').className = 'grid-view';
  });
  createImageModal();
});
var currentImageIndex = 0;
var imageSeriesUrls = [];
function handleImageSeries(url) {
  var urlPattern = url.match(/(.*\[)(0*)(\d+)-(\d+)(\].*)/);
  if (urlPattern) {
    var prefix = urlPattern[1].replace('[', '');
    var leadingZeros = urlPattern[2];
    var startNum = parseInt(urlPattern[3], 10);
    var endNum = parseInt(urlPattern[4], 10);
    var suffix = urlPattern[5].replace(']', '');
    var imageUrls = [];
    for (var i = startNum; i <= endNum; i++) {
      var numStr = leadingZeros + i;
      var formattedNum = leadingZeros.length > 0 ? numStr.padStart(2, '0') : i.toString();
      imageUrls.push("".concat(prefix).concat(formattedNum).concat(suffix));
    }
    fetchImage(imageUrls);
    displayMessage('Image Series');
  } else {
    displayError('Invalid series URL format.');
  }
}
function fetchImage(urls) {
  var imageDisplayArea = document.getElementById('imageDisplay');
  imageDisplayArea.innerHTML = '';
  imageSeriesUrls = urls; // Store the array of image URLs

  urls.forEach(function (url) {
    var image = new Image();
    image.onload = function () {
      displayImage(url, image.naturalWidth, image.naturalHeight);
    };
    image.onerror = function () {
      // Handle broken image links by not attempting to display them
    };
    image.src = url;
  });
}
function displayImage(url, width, height) {
  var imageDisplayArea = document.getElementById('imageDisplay');
  var containerDiv = document.createElement('div');
  containerDiv.className = 'image-container';
  var imgElement = document.createElement('img');
  imgElement.src = url;
  imgElement.className = 'img-fluid';
  imgElement.alt = 'Image';
  var dimensionDiv = document.createElement('div');
  dimensionDiv.className = 'image-info';
  dimensionDiv.textContent = "".concat(width, " x ").concat(height);
  containerDiv.appendChild(imgElement);
  containerDiv.appendChild(dimensionDiv);
  imageDisplayArea.appendChild(containerDiv);
  addClickEventToImages();
}
function displayError(message) {
  var urlError = document.getElementById('urlError');
  urlError.textContent = message;
  urlError.style.color = 'red';
}
function displayMessage(message) {
  var urlError = document.getElementById('urlError');
  urlError.textContent = message;
  urlError.style.color = 'black';
}
function validateUrl(url) {
  var pattern = new RegExp('^(https?:\\/\\/)?' +
  // protocol
  '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' +
  // domain name
  '((\\d{1,3}\\.){3}\\d{1,3}))' +
  // OR ip (v4) address
  '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' +
  // port and path
  '(\\?[;&a-z\\d%_.~+=-]*)?' +
  // query string
  '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
  return pattern.test(url);
}
function addClickEventToImages() {
  var images = document.querySelectorAll('#imageDisplay img');
  images.forEach(function (img) {
    img.removeEventListener('click', handleImageClick); // Remove any existing event to avoid duplicates
    img.addEventListener('click', handleImageClick);
  });
}
function handleImageClick(event) {
  displayModalImage(event.target.src);
}
function displayModalImage(src) {
  // Find the index of the current image
  currentImageIndex = imageSeriesUrls.indexOf(src);

  // Get the modal and modal content containers
  var modal = document.getElementById('imageModal');
  var modalContent = modal.querySelector('.modal-content');

  // Clear only the image and caption from the modal content, preserving the navigation arrows
  var existingImg = modalContent.querySelector('img');
  var existingCaption = modalContent.querySelector('.modal-caption');
  if (existingImg) modalContent.removeChild(existingImg);
  if (existingCaption) modalContent.removeChild(existingCaption);

  // Create a new image element and set its source
  var img = new Image();
  img.onload = function () {
    // Create a caption using the filename and dimensions
    var filename = src.split('/').pop();
    var captionText = "".concat(filename, " - ").concat(img.naturalWidth, " x ").concat(img.naturalHeight);

    // Create and style the caption div
    var captionDiv = document.createElement('div');
    captionDiv.textContent = captionText;
    captionDiv.className = 'modal-caption'; // Use a class for styling the caption

    // Append the new image and caption to the modal content
    modalContent.appendChild(img);
    modalContent.appendChild(captionDiv);
  };
  img.src = src;

  // Show the modal
  modal.style.display = 'block';
  modal.classList.add('show');
}
function navigateNext() {
  console.log("navigateNext fired");
  currentImageIndex = (currentImageIndex + 1) % imageSeriesUrls.length;
  displayModalImage(imageSeriesUrls[currentImageIndex]);
}
function navigatePrevious() {
  console.log("navigatePrevious fired");
  currentImageIndex = (currentImageIndex - 1 + imageSeriesUrls.length) % imageSeriesUrls.length;
  displayModalImage(imageSeriesUrls[currentImageIndex]);
}
function createImageModal() {
  var modal = document.createElement('div');
  modal.id = 'imageModal';
  modal.className = 'image-modal';
  modal.style.display = 'none';
  modal.style.position = 'fixed';
  modal.style.zIndex = '1';
  modal.style.left = '0';
  modal.style.top = '0';
  modal.style.width = '100%';
  modal.style.height = '100%';
  modal.style.overflow = 'auto';
  modal.style.backgroundColor = 'rgba(0, 0, 0, 0.5)'; // Corrected RGBA color

  var modalContent = document.createElement('div');
  modalContent.className = 'modal-content';
  modal.appendChild(modalContent);

  // Create the navigator container
  var navigatorContainer = document.createElement('div');
  navigatorContainer.className = 'modal-navigator';

  // Create navigation arrows
  var prevArrow = document.createElement('span');
  prevArrow.classList.add('material-icons');
  prevArrow.textContent = 'navigate_before';
  prevArrow.onclick = navigatePrevious;
  var nextArrow = document.createElement('span');
  nextArrow.classList.add('material-icons');
  nextArrow.textContent = 'navigate_next';
  nextArrow.onclick = navigateNext;

  // Append arrows to the navigator container
  navigatorContainer.appendChild(prevArrow);
  navigatorContainer.appendChild(nextArrow);

  // Append navigator container to the modal content
  modalContent.appendChild(navigatorContainer);
  document.body.appendChild(modal);

  // Event listeners for the modal
  modal.addEventListener('click', function (event) {
    if (event.target === modal) {
      modal.classList.remove('show');
    }
  });
  modal.addEventListener('transitionend', function (event) {
    if (!modal.classList.contains('show')) {
      modal.style.display = 'none';
    }
  });
  return modal;
}
window.addEventListener('click', function (event) {
  var modal = document.getElementById('imageModal');
  if (event.target === modal) {
    modal.classList.remove('show');
  }
});
//# sourceMappingURL=image-fetcher.js.map
