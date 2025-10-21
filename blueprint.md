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

### V3: Shape Tools, Pan & Zoom, and Creative Brushes

*   **Shape Tools:** New tools to draw perfect rectangles, circles, and straight lines.
*   **Pan & Zoom:** Ability to pan the canvas by dragging and zoom using the mouse wheel.
*   **Creative Brushes:** Addition of a 'Spray' brush and a 'Calligraphy' brush for artistic effects.
*   **UI Update:** The toolbar is reorganized with tool groups for a cleaner and more intuitive layout.

## Current Plan

*   **Implement V3 Features:**
    1.  **Update `index.html`:** Restructure the toolbar to group tools (Brush, Shapes, Navigation). Add new buttons for Rectangle, Circle, Line, Pan, Spray Brush, and Calligraphy Brush.
    2.  **Update `style.css`:** Style the new toolbar groups and buttons, ensuring a clear visual distinction for active tools.
    3.  **Update `main.js`:**
        *   Implement a state management system to track the currently selected tool.
        *   Develop the logic for drawing shapes, including live previews during creation.
        *   Integrate pan (translation) and zoom (scaling) functionality, correctly mapping mouse coordinates.
        *   Implement the custom logic for the 'Spray' and 'Calligraphy' brushes.
        *   Refactor the event listeners to handle the different behaviors of each tool.
    4.  Verify all new features work harmoniously and the app remains robust.