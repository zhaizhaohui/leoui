// js/components/carousel.js

import { animate } from '../core/animate.js'

export default function createCarousel(root) {

    // 防重复初始化（关键）
    if (root.__carousel_inited__) return root.__carousel_instance__
    root.__carousel_inited__ = true

    // =========================
    // 从 DOM 读取配置
    // =========================
    const interval = Number(root.dataset.interval || 3000)
    const autoplay = root.dataset.autoplay !== 'false'

    const track = root.querySelector('.carousel-inner')
    let items = Array.from(root.querySelectorAll('.carousel-item'))

    const prevBtn = root.querySelector('.carousel-control.prev')
    const nextBtn = root.querySelector('.carousel-control.next')
    const dotsWrap = root.querySelector('.carousel-dots')

    let index = 1
    let timer = null
    let width = root.clientWidth

    // =========================
    // 克隆（只做一次）
    // =========================
    const first = items[0].cloneNode(true)
    const last = items[items.length - 1].cloneNode(true)

    track.appendChild(first)
    track.insertBefore(last, items[0])

    items = Array.from(root.querySelectorAll('.carousel-item'))

    track.style.transform = `translateX(-${width * index}px)`

    // =========================
    // dots
    // =========================
    const realCount = items.length - 2

    dotsWrap.innerHTML = ''

    for (let i = 0; i < realCount; i++) {
        const dot = document.createElement('span')
        dot.className = 'dot'
        if (i === 0) dot.classList.add('active')

        dot.addEventListener('click', () => {
            index = i + 1
            move()
        })

        dotsWrap.appendChild(dot)
    }

    const dots = dotsWrap.querySelectorAll('.dot')

    function updateDots() {
        dots.forEach(d => d.classList.remove('active'))
        dots[(index - 1 + realCount) % realCount]?.classList.add('active')
    }

    // =========================
    // 移动
    // =========================
    function move() {
        const x = -index * width
        animate(track, 'slideX', { x })
        updateDots()
    }

    // =========================
    // 边界修复
    // =========================
    function onTransitionEnd() {
        if (index === items.length - 1) {
            index = 1
            track.style.transition = 'none'
            track.style.transform = `translateX(-${width * index}px)`
        }

        if (index === 0) {
            index = items.length - 2
            track.style.transition = 'none'
            track.style.transform = `translateX(-${width * index}px)`
        }
    }

    track.addEventListener('transitionend', onTransitionEnd)

    // =========================
    // 按钮
    // =========================
    function next() {
        index++
        move()
    }

    function prev() {
        index--
        move()
    }

    nextBtn?.addEventListener('click', next)
    prevBtn?.addEventListener('click', prev)

    // =========================
    // autoplay
    // =========================
    function start() {
        if (!autoplay) return
        stop()
        timer = setInterval(() => {
            index++
            move()
        }, interval)
    }

    function stop() {
        if (timer) clearInterval(timer)
    }

    root.addEventListener('mouseenter', stop)
    root.addEventListener('mouseleave', start)

    start()

    // =========================
    // touch
    // =========================
    let startX = 0
    let deltaX = 0
    let isDragging = false

    function onTouchStart(e) {
        startX = e.touches[0].clientX
        isDragging = true
        stop()
    }

    function onTouchMove(e) {
        if (!isDragging) return

        const currentX = e.touches[0].clientX
        deltaX = currentX - startX

        track.style.transition = 'none'
        track.style.transform = `translateX(${ -index * width + deltaX }px)`
    }

    function onTouchEnd() {
        isDragging = false

        if (Math.abs(deltaX) > 50) {
            deltaX > 0 ? index-- : index++
        }

        move()
        start()
        deltaX = 0
    }

    track.addEventListener('touchstart', onTouchStart)
    track.addEventListener('touchmove', onTouchMove)
    track.addEventListener('touchend', onTouchEnd)

    // =========================
    // resize
    // =========================
    function onResize() {
        width = root.clientWidth
        move()
    }

    window.addEventListener('resize', onResize)

    // =========================
    // API
    // =========================
    const instance = {
        next,
        prev,
        go(i) {
            index = i + 1
            move()
        },
        destroy() {
            stop()

            track.removeEventListener('transitionend', onTransitionEnd)
            track.removeEventListener('touchstart', onTouchStart)
            track.removeEventListener('touchmove', onTouchMove)
            track.removeEventListener('touchend', onTouchEnd)

            nextBtn?.removeEventListener('click', next)
            prevBtn?.removeEventListener('click', prev)

            root.removeEventListener('mouseenter', stop)
            root.removeEventListener('mouseleave', start)

            window.removeEventListener('resize', onResize)

            root.__carousel_inited__ = false
        }
    }

    root.__carousel_instance__ = instance

    return instance
}