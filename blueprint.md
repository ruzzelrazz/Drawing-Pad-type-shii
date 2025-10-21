# Simple Drawing Pad

## Overview

A responsive and intuitive digital drawing application built with the HTML5 Canvas API. This app provides a clean interface for users to draw freely, change colors, adjust brush sizes, and erase their work. The design is modern, with a focus on usability and a beautiful, interactive experience.

## Implemented Features

### V1: Core Drawing Functionality

*   **HTML Structure:** A main `<canvas>` element and a floating toolbar.
*   **CSS Styling:** A modern, responsive design with interactive controls and "lifted" UI elements.
*   **JavaScript Logic (Canvas API):
    *   **Drawing Engine:** Smooth drawing with mouse and touch events.
    *   **Brush Controls:** Dynamic brush color and size.
    *   **Eraser & Clear:** Tools for erasing and clearing the canvas.
    *   **Responsiveness:** Canvas adapts to window size.

### V2: Advanced Drawing Tools

*   **Undo/Redo Functionality:** Step backward and forward through drawing actions.
*   **Download Image:** Save the canvas drawing as a PNG file.
*   **Background Color:** A color picker to change the canvas background.
*   **UI Enhancements:** New icons and controls integrated into the toolbar for the new features.

## Current Plan

*   **Implement V2 Features:**
    1.  **Update `index.html`:** Add new buttons to the toolbar for Undo, Redo, Download, and a new color picker for the background.
    2.  **Update `style.css`:** Style the new toolbar icons and ensure they match the existing design, including hover and active states.
    3.  **Update `main.js`:**
        *   Implement an undo/redo history stack to save and restore canvas states.
        *   Create a function to handle downloading the canvas content as an image.
        *   Add logic to change the background color while preserving the existing drawing.
    4.  Verify all new features work correctly and the application remains stable.