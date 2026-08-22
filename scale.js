(function () {
    const DESIGN_WIDTH = 1600;
    const MIN_SCALE = 0.28;

    function init() {
        const canvas = document.getElementById('canvas');
        const wrapper = document.getElementById('scaleWrapper');

        if(!canvas || !wrapper) return;

        function applyScale() {
            canvas.style.transform = 'none';
            const naturalHeight = canvas.offsetHeight;
            
            let scale = window.innerWidth / DESIGN_WIDTH;

            if(scale < MIN_SCALE) {
                scale = MIN_SCALE;
                wrapper.style.overflowX = 'auto';
            } else {
                wrapper.style.overflowX = 'hidden';
            }

            canvas.style.transform = `scale(${scale})`;
            wrapper.style.height = `${naturalHeight * scale}px`;

            const scaledWidth = DESIGN_WIDTH * scale;
            const offsetX = Math.max(0, (window.innerWidth - scaledWidth) / 2);
            canvas.style.marginLeft = `${offsetX}px`;
        }
        
        window.addEventListener('load', applyScale);
        window.addEventListener('resize', applyScale);

        if ('ResizeObserver' in window) {
            new ResizeObserver(applyScale).observe(canvas);
        }
        applyScale();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();

