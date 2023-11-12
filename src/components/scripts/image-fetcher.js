document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('fetchButton').addEventListener('click', function() {
        var imageUrl = document.getElementById('urlInput').value;
        if (imageUrl.includes('[') && imageUrl.includes(']')) {
            handleImageSeries(imageUrl);
        } else if (validateUrl(imageUrl)) {
            fetchImage([imageUrl]);
        } else {
            displayError('Please enter a valid URL.');
        }
    });

    document.getElementById('list-view-toggle').addEventListener('click', function() {
        document.getElementById('imageDisplay').className = 'list-view';
    });

    document.getElementById('grid-view-toggle').addEventListener('click', function() {
        document.getElementById('imageDisplay').className = 'grid-view';
    });

    createImageModal();
});

let currentImageIndex = 0;
let imageSeriesUrls = [];

function handleImageSeries(url) {
    const urlPattern = url.match(/(.*\[)(0*)(\d+)-(\d+)(\].*)/);
    if (urlPattern) {
        const prefix = urlPattern[1].replace('[', '');
        const leadingZeros = urlPattern[2];
        const startNum = parseInt(urlPattern[3], 10);
        const endNum = parseInt(urlPattern[4], 10);
        const suffix = urlPattern[5].replace(']', '');

        let imageUrls = [];
        for (let i = startNum; i <= endNum; i++) {
            const numStr = leadingZeros + i;
            const formattedNum = leadingZeros.length > 0 ? numStr.padStart(2, '0') : i.toString();
            imageUrls.push(`${prefix}${formattedNum}${suffix}`);
        }
        fetchImage(imageUrls);
        displayMessage('Image Series');
    } else {
        displayError('Invalid series URL format.');
    }
}

function fetchImage(urls) {
    const imageDisplayArea = document.getElementById('imageDisplay');
    const spinner = document.getElementById('spinner');

    spinner.removeAttribute('hidden');

    imageDisplayArea.innerHTML = '';

    imageSeriesUrls = urls; // Store the array of image URLs

    urls.forEach(url => {
        const image = new Image();
        image.onload = function() {
            spinner.setAttribute('hidden', '');
            displayImage(url, image.naturalWidth, image.naturalHeight);
        };
        image.onerror = function() {
            spinner.setAttribute('hidden', '');
            // Handle broken image links by not attempting to display them
        };
        image.src = url;
    });
}

function displayImage(url, width, height) {
    const imageDisplayArea = document.getElementById('imageDisplay');
    const containerDiv = document.createElement('div');
    containerDiv.className = 'image-container';

    const imgElement = document.createElement('img');
    imgElement.src = url;
    imgElement.loading = 'lazy';
    imgElement.className = 'img-fluid';
    imgElement.alt = 'Image';

    const dimensionDiv = document.createElement('div');
    dimensionDiv.className = 'image-info';
    dimensionDiv.textContent = `${width} x ${height}`;

    containerDiv.appendChild(imgElement);
    containerDiv.appendChild(dimensionDiv);
    imageDisplayArea.appendChild(containerDiv);

    addClickEventToImages();
}

function displayError(message) {
    const urlError = document.getElementById('urlError');
    urlError.textContent = message;
    urlError.style.color = 'red';
}

function displayMessage(message) {
    const urlError = document.getElementById('urlError');
    urlError.textContent = message;
    urlError.style.color = 'black';
}

function validateUrl(url) {
    const pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
        '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
    return pattern.test(url);
}

function addClickEventToImages() {
    const images = document.querySelectorAll('#imageDisplay img');
    images.forEach(img => {
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
    const modal = document.getElementById('imageModal');
    const modalContent = modal.querySelector('.modal-content');

    // Clear only the image and caption from the modal content, preserving the navigation arrows
    const existingImg = modalContent.querySelector('img');
    const existingCaption = modalContent.querySelector('.modal-caption');

    if (existingImg) modalContent.removeChild(existingImg);
    if (existingCaption) modalContent.removeChild(existingCaption);

    // Create a new image element and set its source
    const img = new Image();
    img.onload = function() {
        // Create a caption using the filename and dimensions
        const filename = src.split('/').pop();
        const captionText = `${filename} - ${img.naturalWidth} x ${img.naturalHeight}`;

        // Create and style the caption div
        const captionDiv = document.createElement('div');
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
    const modal = document.createElement('div');
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

    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';
    modal.appendChild(modalContent);

    // Create the navigator container
    const navigatorContainer = document.createElement('div');
    navigatorContainer.className = 'modal-navigator';

    // Create navigation arrows
    const prevArrow = document.createElement('span');
    prevArrow.classList.add('material-icons');
    prevArrow.textContent = 'navigate_before';
    prevArrow.onclick = navigatePrevious;

    const nextArrow = document.createElement('span');
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
    modal.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.classList.remove('show');
        }
    });

    modal.addEventListener('transitionend', function(event) {
        if (!modal.classList.contains('show')) {
            modal.style.display = 'none';
        }
    });

    return modal;
}

document.addEventListener('keydown', function(event) {
    if (event.key === 'ArrowRight') {
        // Load next image
        currentImageIndex = (currentImageIndex + 1) % imageSeriesUrls.length;
        displayModalImage(imageSeriesUrls[currentImageIndex]);
    } else if (event.key === 'ArrowLeft') {
        // Load previous image
        currentImageIndex = (currentImageIndex - 1 + imageSeriesUrls.length) % imageSeriesUrls.length;
        displayModalImage(imageSeriesUrls[currentImageIndex]);
    }
});


window.addEventListener('click', function(event) {
    const modal = document.getElementById('imageModal');
    if (event.target === modal) {
        modal.classList.remove('show');
    }
});
