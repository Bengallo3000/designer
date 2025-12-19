import { Element } from '../types/Element';

export function generateHTML(elements: Element[], backgroundImage: string | null): string {
  const elementsHTML = elements.map(element => {
    const baseStyle = `
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
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      cursor: pointer;
      user-select: none;
      font-family: 'Orbitron', monospace;
    `;

    const hoverStyle = `
      &:hover {
        transform: rotate(${element.rotation}deg) scale(1.05);
        box-shadow: 0 0 20px rgba(0, 255, 255, 0.5);
        filter: brightness(1.2);
      }
    `;

    switch (element.type) {
      case 'button':
        return `
          <button class="drainer-element drainer-button" style="${baseStyle}">
            ${element.text}
          </button>
        `;
      case 'input':
        return `
          <input type="text" placeholder="${element.text}" class="drainer-element drainer-input" style="${baseStyle}" readonly />
        `;
      case 'image':
        return `
          <div class="drainer-element drainer-image" style="${baseStyle}">
            ${element.text}
          </div>
        `;
      case 'timer':
        return `
          <div class="drainer-element drainer-timer" style="${baseStyle}" data-time="120">
            ${element.text}
          </div>
        `;
      case 'progress':
        return `
          <div class="drainer-element drainer-progress" style="${baseStyle}">
            <div class="progress-fill" style="
              width: 60%;
              height: 100%;
              background: linear-gradient(90deg, #00ffff, #ff00ff);
              border-radius: ${element.borderRadius}px;
              transition: width 0.3s ease;
            "></div>
          </div>
        `;
      case 'qr':
        return `
          <div class="drainer-element drainer-qr" style="${baseStyle}">
            <div style="
              width: 80%;
              height: 80%;
              background: repeating-linear-gradient(
                0deg,
                #000,
                #000 2px,
                #fff 2px,
                #fff 4px
              ), repeating-linear-gradient(
                90deg,
                #000,
                #000 2px,
                #fff 2px,
                #fff 4px
              );
              opacity: 0.8;
            "></div>
          </div>
        `;
      case 'social':
        return `
          <div class="drainer-element drainer-social" style="${baseStyle}">
            <div style="
              width: 24px;
              height: 24px;
              background: ${element.color};
              border-radius: 50%;
              margin-right: 8px;
            "></div>
            ${element.text}
          </div>
        `;
      case 'slider':
        return `
          <div class="drainer-element drainer-slider" style="${baseStyle}">
            <div style="
              width: 100%;
              height: 4px;
              background: ${element.backgroundColor};
              border-radius: 2px;
              position: relative;
            ">
              <div style="
                position: absolute;
                left: 50%;
                top: 50%;
                transform: translate(-50%, -50%);
                width: 16px;
                height: 16px;
                background: ${element.color};
                border-radius: 50%;
                border: 2px solid ${element.borderColor};
                box-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
              "></div>
            </div>
          </div>
        `;
      case 'toggle':
        return `
          <div class="drainer-element drainer-toggle" style="${baseStyle}">
            <div style="
              width: 100%;
              height: 20px;
              background: ${element.backgroundColor};
              border-radius: 10px;
              position: relative;
              border: ${element.borderWidth}px ${element.borderStyle} ${element.borderColor};
            ">
              <div style="
                position: absolute;
                left: 2px;
                top: 2px;
                width: 16px;
                height: 16px;
                background: ${element.color};
                border-radius: 50%;
                transition: transform 0.3s ease;
                box-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
              "></div>
            </div>
          </div>
        `;
      default:
        return `
          <div class="drainer-element drainer-text" style="${baseStyle}">
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
            ${backgroundImage ? `background-image: url('${backgroundImage}');` : ''}
            background-size: cover;
            background-position: center;
            background-attachment: fixed;
            min-height: 100vh;
            overflow: hidden;
            position: relative;
        }
        
        /* Cyberpunk Background Effect */
        body::before {
            content: '';
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: radial-gradient(circle at 20% 50%, rgba(0, 255, 255, 0.1) 0%, transparent 50%),
                        radial-gradient(circle at 80% 50%, rgba(255, 0, 255, 0.1) 0%, transparent 50%),
                        radial-gradient(circle at 50% 100%, rgba(0, 255, 255, 0.05) 0%, transparent 50%);
            pointer-events: none;
            z-index: 0;
        }
        
        .drainer-element {
            position: relative;
            z-index: 1;
            transition: all 0.3s ease;
        }
        
        .drainer-element:hover {
            transform: scale(1.05);
            box-shadow: 0 0 20px rgba(0, 255, 255, 0.5);
            filter: brightness(1.2);
            z-index: 10;
        }
        
        /* Button Styles */
        .drainer-button {
            background: linear-gradient(45deg, #00ffff, #ff00ff);
            border: none;
            color: #000;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 1px;
            animation: glow 2s ease-in-out infinite alternate;
        }
        
        .drainer-button:hover {
            background: linear-gradient(45deg, #ff00ff, #00ffff);
            animation: pulse 0.5s ease-in-out infinite;
        }
        
        /* Input Styles */
        .drainer-input {
            background: rgba(0, 0, 0, 0.7);
            border: 2px solid #00ffff;
            color: #fff;
            padding: 10px 15px;
            border-radius: 8px;
            backdrop-filter: blur(10px);
        }
        
        .drainer-input:focus {
            outline: none;
            box-shadow: 0 0 15px rgba(0, 255, 255, 0.7);
            border-color: #ff00ff;
        }
        
        /* Timer Styles */
        .drainer-timer {
            animation: pulse 2s infinite;
            font-weight: 900;
            text-shadow: 0 0 10px rgba(0, 255, 255, 0.8);
        }
        
        /* Progress Styles */
        .drainer-progress {
            background: rgba(0, 0, 0, 0.5);
            backdrop-filter: blur(5px);
        }
        
        .drainer-progress .progress-fill {
            animation: progressAnimation 3s ease-in-out infinite;
        }
        
        /* QR Code Styles */
        .drainer-qr {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(5px);
        }
        
        /* Social Styles */
        .drainer-social {
            background: rgba(0, 0, 0, 0.5);
            backdrop-filter: blur(10px);
            flex-direction: row;
            gap: 8px;
        }
        
        /* Slider Styles */
        .drainer-slider {
            padding: 0 10px;
        }
        
        /* Toggle Styles */
        .drainer-toggle {
            padding: 0 5px;
        }
        
        /* Text Styles */
        .drainer-text {
            text-shadow: 0 0 5px rgba(0, 255, 255, 0.5);
        }
        
        /* Animations */
        @keyframes pulse {
            0%, 100% { 
                opacity: 1; 
                transform: scale(1);
            }
            50% { 
                opacity: 0.8; 
                transform: scale(1.02);
            }
        }
        
        @keyframes glow {
            0%, 100% { 
                box-shadow: 0 0 5px rgba(0, 255, 255, 0.5);
            }
            50% { 
                box-shadow: 0 0 20px rgba(0, 255, 255, 0.8);
            }
        }
        
        @keyframes progressAnimation {
            0% { width: 0%; }
            50% { width: 80%; }
            100% { width: 60%; }
        }
        
        /* Particle Effect */
        .particle {
            position: fixed;
            width: 2px;
            height: 2px;
            background: #00ffff;
            pointer-events: none;
            z-index: 9999;
            border-radius: 50%;
            box-shadow: 0 0 6px #00ffff;
        }
        
        /* Responsive Design */
        @media (max-width: 768px) {
            .drainer-element {
                transform: scale(0.8);
            }
        }
        
        @media (max-width: 480px) {
            .drainer-element {
                transform: scale(0.6);
            }
        }
    </style>
</head>
<body>
    ${elementsHTML}
    
    <script>
        // Timer functionality
        document.querySelectorAll('.drainer-timer').forEach(timer => {
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
        
        // Toggle functionality
        document.querySelectorAll('.drainer-toggle').forEach(toggle => {
            toggle.addEventListener('click', function() {
                const toggleDot = this.querySelector('div > div');
                const isOn = toggleDot.style.left === 'auto' || toggleDot.style.left === 'calc(100% - 18px)';
                if (isOn) {
                    toggleDot.style.left = '2px';
                    toggleDot.style.background = '#666';
                } else {
                    toggleDot.style.left = 'calc(100% - 18px)';
                    toggleDot.style.background = '#00ff00';
                }
            });
        });
        
        // Slider functionality
        document.querySelectorAll('.drainer-slider').forEach(slider => {
            const sliderDot = slider.querySelector('div > div');
            let isDragging = false;
            
            sliderDot.addEventListener('mousedown', () => isDragging = true);
            document.addEventListener('mouseup', () => isDragging = false);
            document.addEventListener('mousemove', (e) => {
                if (isDragging) {
                    const rect = slider.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
                    sliderDot.style.left = percentage + '%';
                }
            });
        });
        
        // Particle effect
        function createParticle() {
            const particle = document.createElement('div');
            particle.className = 'particle';
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
                    particle.style.transform = 'translateX(' + (Math.sin(progress * Math.PI * 4) * 50) + 'px)';
                    requestAnimationFrame(animate);
                } else {
                    particle.remove();
                }
            }
            
            animate();
        }
        
        // Create particles periodically
        setInterval(createParticle, 300);
        
        // Initial particles
        for (let i = 0; i < 5; i++) {
            setTimeout(createParticle, i * 200);
        }
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