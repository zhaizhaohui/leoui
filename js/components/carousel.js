import { animate } from '../core/animate.js';

export function createCarousel(root, options = {}) {

    const {
        interval = 3000,
        autoplay = true
    } = options;

    const track = root.querySelector('.carousel-inner');
    let items = Array.from(root.querySelectorAll('.carousel-item'));

    const prevBtn = root.querySelector('.carousel-control.prev');
    const nextBtn = root.querySelector('.carousel-control.next');
    const dotsWrap = root.querySelector('.carousel-dots');

    let index = 1;
    let timer = null;
    let width = root.clientWidth;

    // =========================
    // 👉 克隆首尾（实现无限）
    // =========================
    const first = items[0].cloneNode(true);
    const last = items[items.length - 1].cloneNode(true);

    track.appendChild(first);
    track.insertBefore(last, items[0]);

    items = Array.from(root.querySelectorAll('.carousel-item'));

    // 初始位置
    track.style.transform = `translateX(-${width * index}px)`;

    // =========================
    // 👉 dots
    // =========================
    const realCount = items.length - 2;

    for (let i = 0; i < realCount; i++) {
        const dot = document.createElement('span');
        dot.className = 'dot';
        if (i === 0) dot.classList.add('active');

        dot.addEventListener('click', () => {
            index = i + 1;
            move();
        });

        dotsWrap.appendChild(dot);
    }

    const dots = dotsWrap.querySelectorAll('.dot');

    function updateDots() {
        dots.forEach(d => d.classList.remove('active'));
        dots[(index - 1 + realCount) % realCount].classList.add('active');
    }

    // =========================
    // 👉 核心移动函数
    // =========================
    function move(withTransition = true) {

        const x = -index * width;
        animate(track, 'slideX', { x });
        updateDots();
    }

    // =========================
    // 👉 边界修复（无缝）
    // =========================
    track.addEventListener('transitionend', () => {

        if (index === items.length - 1) {
            index = 1;
            move(false);
        }

        if (index === 0) {
            index = items.length - 2;
            move(false);
        }
    });

    // =========================
    // 👉 按钮
    // =========================
    nextBtn?.addEventListener('click', () => {
        index++;
        move();
    });

    prevBtn?.addEventListener('click', () => {
        index--;
        move();
    });

    // =========================
    // 👉 自动播放
    // =========================
    function start() {
        if (!autoplay) return;
        timer = setInterval(() => {
            index++;
            move();
        }, interval);
    }

    function stop() {
        clearInterval(timer);
    }

    root.addEventListener('mouseenter', stop);
    root.addEventListener('mouseleave', start);

    start();

    // =========================
    // 👉 手势支持（移动端）
    // =========================
    let startX = 0;
    let deltaX = 0;
    let isDragging = false;

    track.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        isDragging = true;
        stop();
    });

    track.addEventListener('touchmove', (e) => {
        if (!isDragging) return;

        const currentX = e.touches[0].clientX;
        deltaX = currentX - startX;

        track.style.transition = 'none';
        track.style.transform = `translateX(${ -index * width + deltaX }px)`;
    });

    track.addEventListener('touchend', () => {
        isDragging = false;

        if (Math.abs(deltaX) > 50) {
            if (deltaX > 0) {
                index--;
            } else {
                index++;
            }
        }

        move();
        start();
        deltaX = 0;
    });

    // =========================
    // 👉 resize
    // =========================
    window.addEventListener('resize', () => {
        width = root.clientWidth;
        move(false);
    });

    return {
        next() {
            index++;
            move();
        },
        prev() {
            index--;
            move();
        },
        go(i) {
            index = i + 1;
            move();
        },
        destroy() {
            stop();
        }
    };
}