// js/ui.js

import { registry } from './core/registry.js'

// =========================
// 模块缓存（避免重复 import）
// =========================
const moduleCache = new Map()

// =========================
// 获取组件模块（按需加载）
// =========================
async function getModule(type) {
    if (moduleCache.has(type)) {
        return moduleCache.get(type)
    }

    const loader = registry[type]

    if (!loader) {
        console.warn(`[UI] Unknown component: ${type}`)
        return null
    }

    const mod = await loader()
    moduleCache.set(type, mod)

    return mod.default || mod
}

// =========================
// 初始化单个组件
// =========================
async function init(el) {
    const type = el.dataset.ui
    const mod = await getModule(type)
    const instance = mod(el)
    el.__ui__ = el.__ui__ || {}
    el.__ui__[type] = instance
}
// =========================
// 扫描初始化
// =========================
function scan(root = document) {
    root.querySelectorAll('[data-ui]').forEach(init)
}

// =========================
// 重新扫描（动态 DOM 支持）
// =========================
function refresh(root = document) {
    scan(root)
}

// =========================
// 手动调用组件 API
// =========================
async function use(type, el) {
    const mod = await getModule(type)
    if (!mod) return null

    if (typeof mod === 'function') {
        return mod(el)
    }

    if (typeof mod.init === 'function') {
        return mod.init(el)
    }

    return null
}

// =========================
// 获取组件实例
// =========================
function getInstance(el, type) {
    return el.__ui__?.[type]
}

// =========================
// 自动启动
// =========================
function boot() {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => scan())
    } else {
        scan()
    }
}

// =========================
// 对外 API
// =========================
export const ui = {
    init,
    scan,
    refresh,
    use,
    getInstance
}

// 自动运行
boot()