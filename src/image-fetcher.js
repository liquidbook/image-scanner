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
});

function handleImageSeries(url) {
    const urlPattern = url.match(/(.*\[)(\d+)-(\d+)(\].*)/);
    if (urlPattern) {
        const prefix = urlPattern[1].replace('[', '');
        const startNum = parseInt(urlPattern[2], 10);
        const endNum = parseInt(urlPattern[3], 10);
        const suffix = urlPattern[4].replace(']', '');

        let imageUrls = [];
        for (let i = startNum; i <= endNum; i++) {
            imageUrls.push(`${prefix}${i}${suffix}`);
        }
        fetchImage(imageUrls);
        displayMessage('Image Series');
    } else {
        displayError('Invalid series URL format.');
    }
}

function fetchImage(urls) {
    const imageDisplayArea = document.getElementById('imageDisplay');
    imageDisplayArea.innerHTML = ''; // Clear existing images
    urls.forEach(url => {
        const image = new Image();
        image.onload = function() {
            displayImage(url, image.naturalWidth, image.naturalHeight);
            addClickEventToImages(); // Add click event listeners to images for modal functionality
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
    imgElement.className = 'img-fluid'; // Bootstrap class for responsive images
    imgElement.alt = 'Image';
    
    const dimensionDiv = document.createElement('div');
    dimensionDiv.className = 'image-info';
    dimensionDiv.textContent = `${width} x ${height}`;

    containerDiv.appendChild(imgElement);
    containerDiv.appendChild(dimensionDiv);
    imageDisplayArea.appendChild(containerDiv);
}

function displayError(message) {
    const urlError = document.getElementById('urlError');
    urlError.textContent = message;
    urlError.style.color = 'red';
    addClickEventToImages();
}

function displayMessage(message) {
    const urlError = document.getElementById('urlError');
    urlError.textContent = message;
    urlError.style.color = 'black';
}

function validateUrl(url) {
    // Simple URL validation function
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
        img.addEventListener('click', function(event) {
            displayModalImage(event.target.src);
        });
    });
}

function displayModalImage(src) {
    const modal = document.getElementById('imageModal') || createImageModal();
    const modalContent = modal.querySelector('.modal-content');
    modalContent.innerHTML = ''; // Clear existing content

    const img = document.createElement('img');
    img.src = src;
    img.style.width = '100%';
    img.style.height = 'auto';
    modalContent.appendChild(img);

    modal.style.display = 'block'; // Show the modal
    modal.classList.add('show'); // Add class to start the animation
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

    // Close modal on clicking the modal background
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

    // Listen for the end of the transition to set display to none
    modal.addEventListener('transitionend', function(event) {
        if (event.propertyName === 'opacity' && !modal.classList.contains('show')) {
            modal.style.display = 'none';
        }
    });
}

window.addEventListener('click', function(event) {
    const modal = document.getElementById('imageModal');
    if (event.target === modal) {
        modal.classList.remove('show');
    }
});