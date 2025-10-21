document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('drawing-canvas');
    const ctx = canvas.getContext('2d', { willReadFrequently: true });

    // Tool buttons & inputs
    const toolBtns = document.querySelectorAll('.tool-btn[data-tool]');
    const colorPicker = document.getElementById('color-picker');
    const brushSizeSlider = document.getElementById('brush-size');
    const bgColorPicker = document.getElementById('bg-color-picker');
    const clearBtn = document.getElementById('clear-btn');
    const downloadBtn = document.getElementById('download-btn');
    const undoBtn = document.getElementById('undo-btn');
    const redoBtn = document.getElementById('redo-btn');

    // State variables
    let activeTool = 'brush';
    let isDrawing = false;
    let isPanning = false;
    let startX, startY, lastX, lastY;
    let snapshot;

    // Pan & Zoom state
    let transform = { x: 0, y: 0, scale: 1 };

    // History
    let history = [];
    let historyStep = -1;

    function setCanvasSize() {
        const dpr = window.devicePixelRatio || 1;
        const size = Math.min(window.innerWidth, window.innerHeight) * 0.8;
        canvas.width = size * dpr;
        canvas.height = size * dpr;
        canvas.style.width = `${size}px`;
        canvas.style.height = `${size}px`;
        ctx.scale(dpr, dpr);
        redrawCanvas();
    }

    function getTransformedCoords(event) {
        const rect = canvas.getBoundingClientRect();
        let x = (event.clientX - rect.left - transform.x) / transform.scale;
        let y = (event.clientY - rect.top - transform.y) / transform.scale;
        return { x, y };
    }

    function startAction(e) {
        e.preventDefault();
        if (activeTool === 'pan') {
            isPanning = true;
            startX = e.clientX - transform.x;
            startY = e.clientY - transform.y;
            canvas.style.cursor = 'grabbing';
            return;
        }

        isDrawing = true;
        const coords = getTransformedCoords(e);
        startX = coords.x;
        startY = coords.y;
        lastX = coords.x;
        lastY = coords.y;

        ctx.save();
        ctx.translate(transform.x, transform.y);
        ctx.scale(transform.scale, transform.scale);
        snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
        ctx.restore();
        
        ctx.beginPath();
    }

    function performAction(e) {
        e.preventDefault();
        if (isPanning) {
            transform.x = e.clientX - startX;
            transform.y = e.clientY - startY;
            redrawCanvas();
            return;
        }

        if (!isDrawing) return;
        const coords = getTransformedCoords(e);

        redrawCanvas(); // Redraw to show preview
        ctx.save();
        ctx.translate(transform.x, transform.y);
        ctx.scale(transform.scale, transform.scale);
        if (snapshot) ctx.putImageData(snapshot, 0, 0);

        // Apply styles
        ctx.strokeStyle = colorPicker.value;
        ctx.fillStyle = colorPicker.value;
        ctx.lineWidth = brushSizeSlider.value / transform.scale;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        switch (activeTool) {
            case 'brush':
            case 'eraser':
                drawLine(coords.x, coords.y);
                break;
            case 'spray':
                drawSpray(coords.x, coords.y);
                break;
             case 'calligraphy':
                drawCalligraphy(coords.x, coords.y);
                break;
            case 'line':
                drawLineShape(coords.x, coords.y);
                break;
            case 'rectangle':
                drawRectShape(coords.x, coords.y);
                break;
            case 'circle':
                drawCircleShape(coords.x, coords.y);
                break;
        }
        ctx.restore();
    }

    function endAction(e) {
        if (isPanning) {
            isPanning = false;
            canvas.style.cursor = 'grab';
        } 
        if (isDrawing) {
            isDrawing = false;
            saveToHistory(ctx.getImageData(0, 0, canvas.width, canvas.height));
        }
    }

    // -- Drawing Implementations --
    function drawLine(x, y) {
        ctx.strokeStyle = activeTool === 'eraser' ? bgColorPicker.value : colorPicker.value;
        ctx.lineTo(x, y);
        ctx.stroke();
        [lastX, lastY] = [x, y];
    }
    
    function drawCalligraphy(x, y) {
        ctx.lineWidth = brushSizeSlider.value / transform.scale;
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(x, y);
        ctx.stroke();
        [lastX, lastY] = [x,y];
    }

    function drawSpray(x, y) {
        const radius = brushSizeSlider.value / 2;
        for (let i = 0; i < 30; i++) {
            const angle = Math.random() * 2 * Math.PI;
            const r = Math.random() * radius;
            ctx.fillRect(x + Math.cos(angle) * r, y + Math.sin(angle) * r, 1, 1);
        }
    }

    function drawLineShape(x, y) {
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(x, y);
        ctx.stroke();
    }

    function drawRectShape(x, y) {
        ctx.beginPath();
        ctx.rect(startX, startY, x - startX, y - startY);
        ctx.stroke();
    }

    function drawCircleShape(x, y) {
        const radius = Math.sqrt(Math.pow(x - startX, 2) + Math.pow(y - startY, 2));
        ctx.beginPath();
        ctx.arc(startX, startY, radius, 0, 2 * Math.PI);
        ctx.stroke();
    }

    function handleZoom(e) {
        e.preventDefault();
        const scaleAmount = e.deltaY > 0 ? 0.9 : 1.1;
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        transform.x = mouseX - (mouseX - transform.x) * scaleAmount;
        transform.y = mouseY - (mouseY - transform.y) * scaleAmount;
        transform.scale *= scaleAmount;

        // Clamp zoom
        transform.scale = Math.max(0.1, Math.min(10, transform.scale));
        redrawCanvas();
    }

    function redrawCanvas() {
        ctx.save();
        ctx.fillStyle = bgColorPicker.value;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.restore();

        if (history[historyStep]) {
             ctx.putImageData(history[historyStep], 0, 0);
        }
    }

    function saveToHistory(data) {
        if (historyStep < history.length - 1) {
            history.splice(historyStep + 1);
        }
        history.push(data);
        historyStep++;
        updateUndoRedo();
    }

    function undo() {
        if (historyStep > 0) {
            historyStep--;
            redrawCanvas();
            updateUndoRedo();
        }
    }

    function redo() {
        if (historyStep < history.length - 1) {
            historyStep++;
            redrawCanvas();
            updateUndoRedo();
        }
    }

    function updateUndoRedo() {
        undoBtn.disabled = historyStep <= 0;
        redoBtn.disabled = historyStep >= history.length - 1;
    }

    function switchTool(e) {
        const tool = e.currentTarget.dataset.tool;
        activeTool = tool;
        
        toolBtns.forEach(btn => btn.classList.remove('active-tool'));
        e.currentTarget.classList.add('active-tool');

        canvas.style.cursor = tool === 'pan' ? 'grab' : 'crosshair';
    }
    
    // -- Event Listeners --
    canvas.addEventListener('mousedown', startAction);
    canvas.addEventListener('mousemove', performAction);
    canvas.addEventListener('mouseup', endAction);
    canvas.addEventListener('mouseout', endAction);
    canvas.addEventListener('wheel', handleZoom);

    toolBtns.forEach(btn => btn.addEventListener('click', switchTool));
    clearBtn.addEventListener('click', () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        saveToHistory(ctx.getImageData(0, 0, canvas.width, canvas.height));
    });
    downloadBtn.addEventListener('click', () => {
        const link = document.createElement('a');
        link.download = 'drawing.png';
        link.href = canvas.toDataURL();
        link.click();
    });
    undoBtn.addEventListener('click', undo);
    redoBtn.addEventListener('click', redo);
    bgColorPicker.addEventListener('change', () => {
        redrawCanvas();
        saveToHistory(ctx.getImageData(0, 0, canvas.width, canvas.height));
    });

    // Initial setup
    window.addEventListener('resize', setCanvasSize);
    setCanvasSize();
    feather.replace();
    saveToHistory(ctx.getImageData(0, 0, canvas.width, canvas.height));
});