document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('drawing-canvas');
    const ctx = canvas.getContext('2d', { willReadFrequently: true });

    const colorPicker = document.getElementById('color-picker');
    const brushSizeSlider = document.getElementById('brush-size');
    const eraserBtn = document.getElementById('eraser-btn');
    const clearBtn = document.getElementById('clear-btn');
    const undoBtn = document.getElementById('undo-btn');
    const redoBtn = document.getElementById('redo-btn');
    const downloadBtn = document.getElementById('download-btn');
    const bgColorPicker = document.getElementById('bg-color-picker');

    let isDrawing = false;
    let isErasing = false;
    let lastX = 0;
    let lastY = 0;

    let history = [ctx.getImageData(0, 0, canvas.width, canvas.height)];
    let historyStep = 0;

    function setCanvasSize() {
        const dpr = window.devicePixelRatio || 1;
        const size = Math.min(window.innerWidth, window.innerHeight) * 0.85;
        
        // Preserve drawing
        const drawing = ctx.getImageData(0, 0, canvas.width, canvas.height);

        canvas.width = size * dpr;
        canvas.height = size * dpr;
        canvas.style.width = `${size}px`;
        canvas.style.height = `${size}px`;

        ctx.scale(dpr, dpr);
        
        // Restore drawing
        ctx.putImageData(drawing, 0, 0);
    }

    function getCoordinates(event) {
        let x, y;
        if (event.touches && event.touches.length > 0) {
            x = event.touches[0].clientX;
            y = event.touches[0].clientY;
        } else {
            x = event.clientX;
            y = event.clientY;
        }
        const rect = canvas.getBoundingClientRect();
        return [x - rect.left, y - rect.top];
    }

    function startDrawing(e) {
        isDrawing = true;
        [lastX, lastY] = getCoordinates(e);
    }

    function draw(e) {
        if (!isDrawing) return;
        e.preventDefault();

        const [currentX, currentY] = getCoordinates(e);
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(currentX, currentY);

        ctx.strokeStyle = isErasing ? bgColorPicker.value : colorPicker.value;
        ctx.lineWidth = brushSizeSlider.value;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke();

        [lastX, lastY] = [currentX, currentY];
    }

    function stopDrawing() {
        if (isDrawing) {
            isDrawing = false;
            saveHistory();
        }
    }

    function saveHistory() {
        if (historyStep < history.length - 1) {
            history.splice(historyStep + 1);
        }
        history.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
        historyStep++;
        updateUndoRedoButtons();
    }

    function undo() {
        if (historyStep > 0) {
            historyStep--;
            ctx.putImageData(history[historyStep], 0, 0);
            updateUndoRedoButtons();
        }
    }

    function redo() {
        if (historyStep < history.length - 1) {
            historyStep++;
            ctx.putImageData(history[historyStep], 0, 0);
            updateUndoRedoButtons();
        }
    }

    function updateUndoRedoButtons() {
        undoBtn.disabled = historyStep === 0;
        redoBtn.disabled = historyStep === history.length - 1;
    }

    function toggleEraser() {
        isErasing = !isErasing;
        eraserBtn.classList.toggle('active', isErasing);
    }

    function clearCanvas() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // We need to re-apply the background color after clearing
        const currentBgColor = bgColorPicker.value;
        ctx.fillStyle = currentBgColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        saveHistory();
    }

    function downloadImage() {
        const link = document.createElement('a');
        link.download = 'drawing.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
    }
    
    function changeBackgroundColor() {
        const oldBgColor = canvas.style.backgroundColor;
        const newBgColor = bgColorPicker.value;
        canvas.style.backgroundColor = newBgColor;

        // To preserve the drawing, we'll iterate through the pixels
        // This is a simplified approach. For complex drawings, this can be slow.
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        // This part is tricky without knowing the previous background color in a simple way.
        // A better approach is to redraw everything on a new background.
        // For now, we will simply fill the background and ask the user to redraw.
        ctx.fillStyle = newBgColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Restore the previous drawing
        ctx.putImageData(history[historyStep], 0, 0);
    }

    // Event Listeners
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);
    canvas.addEventListener('touchstart', (e) => { e.preventDefault(); startDrawing(e); }, { passive: false });
    canvas.addEventListener('touchmove', (e) => { e.preventDefault(); draw(e); }, { passive: false });
    canvas.addEventListener('touchend', stopDrawing);

    eraserBtn.addEventListener('click', toggleEraser);
    clearBtn.addEventListener('click', clearCanvas);
    undoBtn.addEventListener('click', undo);
    redoBtn.addEventListener('click', redo);
    downloadBtn.addEventListener('click', downloadImage);
    bgColorPicker.addEventListener('input', changeBackgroundColor);

    // Initial setup
    setCanvasSize();
    canvas.style.backgroundColor = bgColorPicker.value;
    window.addEventListener('resize', setCanvasSize);
    feather.replace();
    updateUndoRedoButtons();
    saveHistory();
});