import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Test cube
 */
//Galaxy
const parameters = {

}
parameters.count = 10000
parameters.size = .01
parameters.radius = 5
parameters.branches = 3

let geometry = null
let material = null
let points = null
const generateGalaxy = () => {
    // Destroy old galaxy
    if (points !== null) {
        geometry.dispose()
        material.dispose()
        scene.remove(points)
    }
    geometry = new THREE.BufferGeometry()
    const poistionArray = new Float32Array(parameters.count * 3)
    for (let i = 0; i < parameters.count; i++) {
        const i3 = i * 3
        const radius = Math.random() * parameters.radius
        console.log(radius);
        const branchAngle = (i % parameters.branches) / parameters.branches * Math.PI * 2
        poistionArray[i3 + 0] = Math.cos(branchAngle) * radius
        poistionArray[i3 + 1] = 0
        poistionArray[i3 + 2] = Math.sin(branchAngle) * radius
        // poistionArray[i3 + 0] = (Math.random() - .5) * 3
        // poistionArray[i3 + 1] = (Math.random() - .5) * 3
        // poistionArray[i3 + 2] = (Math.random() - .5) * 3
    }
    geometry.setAttribute(
        "position",
        new THREE.BufferAttribute(poistionArray, 3)
    )

    //Material
    material = new THREE.PointsMaterial({
        size: parameters.size,
        sizeAttenuation: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending
    })

    //points
    points = new THREE.Points(geometry, material)
    scene.add(points)

}
generateGalaxy();

gui.add(parameters, "count").min(100).max(100000).step(100).onFinishChange(generateGalaxy)
gui.add(parameters, "size").max(.1).min(.001).step(.01).onFinishChange(generateGalaxy)
gui.add(parameters, "radius").max(20).min(.01).step(.01).onFinishChange(generateGalaxy)
gui.add(parameters, "branches").max(20).min(2).step(1).onFinishChange(generateGalaxy)
/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 3
camera.position.y = 3
camera.position.z = 3
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()