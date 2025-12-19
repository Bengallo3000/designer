import { Element } from '../types/Element';

export const generateHTML = (elements: Element[], backgroundImage: string): string => {
  const elementHTML = elements.map(el => {
    const style = `
      position: absolute;
      left: ${el.x}px;
      top: ${el.y}px;
      width: ${el.width}px;
      height: ${el.height}px;
      color: ${el.color};
      background: ${el.backgroundColor};
      transform: rotate(${el.rotation}deg);
      opacity: ${el.opacity};
      border-radius: ${el.borderRadius}px;
      font-size: ${el.fontSize}px;
      font-weight: ${el.fontWeight};
      border: ${el.borderWidth}px ${el.borderStyle} ${el.borderColor};
      z-index: ${el.zIndex};
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.3s ease;
    `;

    switch (el.type) {
      case 'button':
        return `<button style="${style}" class="drainer-btn">${el.text}</button>`;
      case 'input':
        return `<input style="${style}" value="${el.text}" placeholder="${el.text}" />`;
      case 'timer':
        return `<div style="${style}" class="drainer-timer" data-time="59">${el.text}</div>`;
      case 'image':
        return `<div style="${style}">${el.text}</div>`;
      default:
        return `<div style="${style}">${el.text}</div>`;
    }
  }).join('\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Drainer Studio Export</title>
    <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap" rel="stylesheet">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: 'Orbitron', monospace;
            background: #0a0a0a;
            color: #ffffff;
            overflow: hidden;
            position: relative;
            width: 100vw;
            height: 100vh;
            ${backgroundImage ? `background-image: url('${backgroundImage}'); background-size: cover; background-position: center;` : ''}
        }
        .drainer-btn:hover {
            box-shadow: 0 0 20px rgba(0, 255, 255, 0.8);
            transform: rotate(${elements.find(el => el.type === 'button')?.rotation || 0}deg) scale(1.05);
        }
        .drainer-timer {
            animation: pulse 2s infinite;
        }
        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.7; }
        }
    </style>
</head>
<body>
    ${elementHTML}
    <script>
        // Timer functionality
        document.querySelectorAll('.drainer-timer').forEach(timer => {
            let time = parseInt(timer.dataset.time) || 59;
            setInterval(() => {
                const minutes = Math.floor(time / 60);
                const seconds = time % 60;
                timer.textContent = '⏱️ ' + 
                    String(minutes).padStart(2, '0') + ':' + 
                    String(seconds).padStart(2, '0');
                if (time > 0) time--;
            }, 1000);
        });
    </script>
</body>
</html>`;
};

export const downloadHTML = (html: string) => {
  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `drainer-${Date.now()}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};