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
    imageDisplayArea.innerHTML = '';

    imageSeriesUrls = urls; // Store the array of image URLs

    urls.forEach(url => {
        const image = new Image();
        image.onload = function() {
            displayImage(url, image.naturalWidth, image.naturalHeight);
        };
        image.onerror = function() {
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
    currentImageIndex = imageSeriesUrls.indexOf(src);

    const modal = document.getElementById('imageModal');
    const modalContent = modal.querySelector('.modal-content');
    modalContent.innerHTML = '';

    const img = new Image();
    img.onload = function() {
        const filename = src.split('/').pop();
        const captionText = `${filename} - ${img.naturalWidth} x ${img.naturalHeight}`;

        const captionDiv = document.createElement('div');
        captionDiv.textContent = captionText;
        captionDiv.style.textAlign = 'center';
        captionDiv.style.padding = '10px 0';

        modalContent.appendChild(img);
        modalContent.appendChild(captionDiv);

        modal.style.display = 'block';
        modal.classList.add('show');
    };
    img.src = src;

    if (!modal.querySelector('.modal-content')) {
        modal.appendChild(modalContent);
    }
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
    modal.style.backgroundColor = 'rgba(0,0,0,0.5)'; // Background color with opacity

    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';
    modal.appendChild(modalContent);

    document.body.appendChild(modal);

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

    // Append navigation arrows to the modal
    const nextArrow = document.createElement('span');
    nextArrow.classList.add('material-icons');
    nextArrow.textContent = 'navigate_next';
    nextArrow.onclick = navigateNext;

    const prevArrow = document.createElement('span');
    prevArrow.classList.add('material-icons');
    prevArrow.textContent = 'navigate_before';
    prevArrow.onclick = navigatePrevious;

    modalContent.appendChild(prevArrow);
    modalContent.appendChild(nextArrow);

    return modal;
}

function navigateNext() {
    currentImageIndex = (currentImageIndex + 1) % imageSeriesUrls.length;
    displayModalImage(imageSeriesUrls[currentImageIndex]);
}

function navigatePrevious() {
    currentImageIndex = (currentImageIndex - 1 + imageSeriesUrls.length) % imageSeriesUrls.length;
    displayModalImage(imageSeriesUrls[currentImageIndex]);
}

window.addEventListener('click', function(event) {
    const modal = document.getElementById('imageModal');
    if (event.target === modal) {
        modal.classList.remove('show');
    }
});
