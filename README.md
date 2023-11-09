# Image Fetcher Web App

The Image Fetcher is a web application designed for browsing and viewing images from specified URL ranges. It allows users to easily fetch and display a series of images, navigate through them, and view them in a responsive modal.

## Key Features

- **URL Input**: Users can input a URL with a range to fetch a series of images, e.g., `https://example.com/gallery/image-[1-20].jpg`.
- **URL Validation**: The app validates the entered URL format and provides feedback if the URL is not valid.
- **Image Series Fetching**: If a range is specified in the URL, the app fetches all images in that series, accommodating formats with leading zeros.
- **Responsive Layout**: Images are displayed responsively in a grid or list layout, with a toggle between these views provided by Material icons.
- **Bootstrap Framework**: Utilizes the Bootstrap framework to ensure a consistent and responsive design across various devices and screen sizes.
- **Modal Image View**: Clicking an image opens it in a modal window with a semi-transparent background for focused viewing.
- **Image Caption**: The modal displays the image filename and dimensions as a caption.
- **Navigation Arrows**: Users can navigate to the next or previous image in the series directly within the modal, with the navigation facilitated by Material icons.
- **Circular Navigation**: The image navigation wraps around, allowing users to cycle from the last image back to the first and vice versa.

## How to Use

Simply enter the URL in the input field provided on the page. If the URL includes a range, use the bracketed notation like `[1-20]` to fetch multiple images. Use the list and grid icons to switch between the different display modes.

Enjoy browsing through images with ease and a focus on great user experience.

---

*Note: This project is currently hosted on GitHub and is open to contributions. If you encounter any issues or would like to suggest enhancements, please open an issue or submit a pull request.*

