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

            let y = rect.top;
            let velocity = 0;
            const gravity = 0.8;
            const bounce = 0.45;
            const floor = window.innerHeight - rect.height;

            setTimeout(() => {
                function fall() {
                    velocity += gravity;
                    y += velocity;

                    if (y >= floor) {
                        y = floor;
                        velocity *= -bounce;

                        if (Math.abs(velocity) < 1) {
                            velocity = 0;
                            return;
                        }
                    }

                    el.style.top = `${y}px`;
                    requestAnimationFrame(fall);
                }

                fall();
            }, index * 20);
        });
    }, 300000);
});