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
parameters.count = 100000
parameters.size = .01
parameters.radius = 5
parameters.branches = 4
parameters.spin = 1
parameters.randomNess = .2
parameters.randomNessPower = 3
parameters.insideColor = "#ff6030"
parameters.outsideColor = "#1b3984"

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
    const positionColorArray = new Float32Array(parameters.count * 3)
    const colorInside = new THREE.Color(parameters.insideColor)
    const colorOutside = new THREE.Color(parameters.outsideColor)
    for (let i = 0; i < parameters.count; i++) {
        const i3 = i * 3
        const radius = Math.random() * parameters.radius
        const spinAngle = radius * parameters.spin
        // console.log(radius);
        const branchAngle = (i % parameters.branches) / parameters.branches * Math.PI * 2

        const randomX = Math.pow(Math.random(), parameters.randomNessPower) * (Math.random() < 0.5 ? 1 : -1)
        const randomY = Math.pow(Math.random(), parameters.randomNessPower) * (Math.random() < 0.5 ? 1 : -1)
        const randomZ = Math.pow(Math.random(), parameters.randomNessPower) * (Math.random() < 0.5 ? 1 : -1)

        poistionArray[i3 + 0] = Math.cos(branchAngle + spinAngle) * radius + randomX
        poistionArray[i3 + 1] = randomY
        poistionArray[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ
        // console.log(Math.sin(branchAngle) * radius, "z")
        //color


        const mixedColor = colorInside.clone()
        mixedColor.lerp(colorOutside, radius / parameters.radius)
        positionColorArray[i3 + 0] = mixedColor.r
        positionColorArray[i3 + 1] = mixedColor.g
        positionColorArray[i3 + 2] = mixedColor.b
    }
    geometry.setAttribute(
        "position",
        new THREE.BufferAttribute(poistionArray, 3)
    )
    geometry.setAttribute(
        "color",
        new THREE.BufferAttribute(positionColorArray, 3)
    )

    //Material
    material = new THREE.PointsMaterial({
        size: parameters.size,
        sizeAttenuation: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexColors: true
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
gui.add(parameters, "spin").max(5).min(-5).step(.001).onFinishChange(generateGalaxy)
gui.add(parameters, "randomNess").max(2).min(0).step(.001).onFinishChange(generateGalaxy)
gui.add(parameters, "randomNessPower").max(10).min(1).step(.001).onFinishChange(generateGalaxy)
gui.addColor(parameters, "insideColor").onFinishChange(generateGalaxy)
gui.addColor(parameters, "outsideColor").onFinishChange(generateGalaxy)
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
    points.rotation.y = elapsedTime * .07
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()