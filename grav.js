document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        const elements = [...document.body.querySelectorAll('*')];

        elements.forEach((el, index) => {
            const rect = el.getBoundingClientRect();

            el.style.position = 'fixed';
            el.style.left = `${rect.left}px`;
            el.style.top = `${rect.top}px`;
            el.style.width = `${rect.width}px`;
            el.style.height = `${rect.height}px`;
            el.style.margin = '0';
            el.style.zIndex = '9999';

            el.dataset.x = rect.left;
            el.dataset.y = rect.top;
            el.dataset.vx = 0;
            el.dataset.vy = 0;
        });

        let gravityX = 0;
        let gravityY = 1;

        window.addEventListener('deviceorientation', event => {
            gravityX = Math.max(-1, Math.min(1, event.gamma / 45));
            gravityY = Math.max(-1, Math.min(1, event.beta / 45));
        });

        function animate() {
            elements.forEach(el => {
                let x = parseFloat(el.dataset.x);
                let y = parseFloat(el.dataset.y);
                let vx = parseFloat(el.dataset.vx);
                let vy = parseFloat(el.dataset.vy);

                vx += gravityX * 0.8;
                vy += gravityY * 0.8;

                x += vx;
                y += vy;

                const width = el.offsetWidth;
                const height = el.offsetHeight;

                if (x < 0) {
                    x = 0;
                    vx *= -0.45;
                }

                if (x + width > window.innerWidth) {
                    x = window.innerWidth - width;
                    vx *= -0.45;
                }

                if (y < 0) {
                    y = 0;
                    vy *= -0.45;
                }

                if (y + height > window.innerHeight) {
                    y = window.innerHeight - height;
                    vy *= -0.45;
                }

                el.dataset.x = x;
                el.dataset.y = y;
                el.dataset.vx = vx;
                el.dataset.vy = vy;

                el.style.left = `${x}px`;
                el.style.top = `${y}px`;
            });

            requestAnimationFrame(animate);
        }

        animate();
    }, 300000);
});