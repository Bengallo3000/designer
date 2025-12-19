import { Element } from '../types/Element';

export function generateHTML(elements: Element[], backgroundImage: string | null): string {
  const elementsHTML = elements.map(element => {
    const style = `
      position: absolute;
      left: ${element.x}px;
      top: ${element.y}px;
      width: ${element.width}px;
      height: ${element.height}px;
      color: ${element.color};
      background: ${element.backgroundColor};
      transform: rotate(${element.rotation}deg);
      opacity: ${element.opacity};
      border-radius: ${element.borderRadius}px;
      font-size: ${element.fontSize}px;
      font-weight: ${element.fontWeight};
      border: ${element.borderWidth}px ${element.borderStyle} ${element.borderColor};
      z-index: ${element.zIndex};
      transition: all 0.3s ease;
    `;

    const hoverStyle = `
      &:hover {
        transform: rotate(${element.rotation}deg) scale(1.05);
        box-shadow: 0 0 20px rgba(0, 255, 255, 0.5);
      }
    `;

    switch (element.type) {
      case 'button':
        return `
          <button class="drainer-element" style="${style}">
            ${element.text}
          </button>
        `;
      case 'input':
        return `
          <input type="text" placeholder="${element.text}" class="drainer-element" style="${style}" readonly />
        `;
      case 'image':
        return `
          <div class="drainer-element" style="${style}">
            ${element.text}
          </div>
        `;
      case 'timer':
        return `
          <div class="drainer-element timer" style="${style}" data-time="120">
            ${element.text}
          </div>
        `;
      case 'progress':
        return `
          <div class="drainer-element" style="${style}">
            <div style="width: 60%; height: 100%; background: linear-gradient(90deg, #00ffff, #ff00ff); border-radius: ${element.borderRadius}px;"></div>
          </div>
        `;
      default:
        return `
          <div class="drainer-element" style="${style}">
            ${element.text}
          </div>
        `;
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
            background-image: ${backgroundImage ? `url('${backgroundImage}')` : 'none'};
            background-size: cover;
            background-position: center;
            min-height: 100vh;
            overflow: hidden;
            position: relative;
        }
        
        .drainer-element {
            cursor: pointer;
            user-select: none;
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
        }
        
        .drainer-element:hover {
            transform: scale(1.05);
            box-shadow: 0 0 20px rgba(0, 255, 255, 0.5);
            filter: brightness(1.2);
        }
        
        .timer {
            animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.7; }
        }
        
        @keyframes glow {
            0%, 100% { box-shadow: 0 0 5px rgba(0, 255, 255, 0.5); }
            50% { box-shadow: 0 0 20px rgba(0, 255, 255, 0.8); }
        }
        
        button {
            background: linear-gradient(45deg, #00ffff, #ff00ff);
            border: none;
            color: #000;
            font-weight: bold;
            transition: all 0.3s ease;
        }
        
        button:hover {
            background: linear-gradient(45deg, #ff00ff, #00ffff);
            animation: glow 1s infinite;
        }
        
        input {
            background: rgba(0, 0, 0, 0.5);
            border: 2px solid #00ffff;
            color: #fff;
            padding: 10px;
            border-radius: 8px;
        }
        
        input:focus {
            outline: none;
            box-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
        }
        
        @media (max-width: 768px) {
            .drainer-element {
                transform: scale(0.8);
            }
        }
    </style>
</head>
<body>
    ${elementsHTML}
    
    <script>
        // Timer functionality
        document.querySelectorAll('.timer').forEach(timer => {
            let time = parseInt(timer.dataset.time) || 120;
            setInterval(() => {
                const minutes = Math.floor(time / 60);
                const seconds = time % 60;
                timer.textContent = '⏱️ ' + 
                    String(minutes).padStart(2, '0') + ':' + 
                    String(seconds).padStart(2, '0');
                if (time > 0) time--;
            }, 1000);
        });
        
        // Add particle effect
        function createParticle() {
            const particle = document.createElement('div');
            particle.style.cssText = \`
                position: fixed;
                width: 2px;
                height: 2px;
                background: #00ffff;
                pointer-events: none;
                z-index: 9999;
                border-radius: 50%;
                box-shadow: 0 0 6px #00ffff;
            \`;
            particle.style.left = Math.random() * window.innerWidth + 'px';
            particle.style.top = window.innerHeight + 'px';
            document.body.appendChild(particle);
            
            const duration = Math.random() * 3000 + 2000;
            const startTime = Date.now();
            
            function animate() {
                const elapsed = Date.now() - startTime;
                const progress = elapsed / duration;
                
                if (progress < 1) {
                    particle.style.top = (window.innerHeight - (window.innerHeight * progress)) + 'px';
                    particle.style.opacity = 1 - progress;
                    requestAnimationFrame(animate);
                } else {
                    particle.remove();
                }
            }
            
            animate();
        }
        
        // Create particles periodically
        setInterval(createParticle, 300);
    </script>
</body>
</html>`;
}

export function downloadHTML(htmlContent: string) {
  const blob = new Blob([htmlContent], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `drainer-${Date.now()}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}