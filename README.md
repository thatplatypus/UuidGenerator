# UUID Generator

A lightweight, vanilla JavaScript Progressive Web App (PWA) for generating UUIDs.

## Features

- Generate RFC-compliant UUIDs
- Support for both v4 (random) and v1 (time-based) UUID formats
- Multiple display formats (standard, no hyphens, with braces)
- Copy to clipboard functionality
- History of recently generated UUIDs
- Works offline as a PWA
- Modern, clean UI inspired by ShadCN
- No dependencies - pure vanilla JS, CSS, and HTML
- Dark mode support based on system preference

## Usage

### Online

Visit the GitHub Pages deployment at: [https://thatplatypus.github.io/UuidGenerator/](https://thatplatypus.github.io/UuidGenerator/)

### Local Development

1. Clone the repository:
   ```
   git clone https://github.com/tombrewer/UuidGenerator.git
   cd UuidGenerator
   ```

2. Serve the files locally using any static file server:
   ```
   # Using Python
   python -m http.server
   
   # Or using npm's serve
   npx serve
   ```

3. Open your browser and navigate to `http://localhost:8000` (or whatever port your server uses)

## PWA Installation

On supported browsers, you can install the UUID Generator as a Progressive Web App:

1. Visit the app in your browser
2. Look for the install option in your browser's address bar or menu
3. Follow the prompts to add the app to your home screen or desktop

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. 
