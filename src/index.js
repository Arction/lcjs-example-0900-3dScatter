/*
 * LightningChartJS example that showcases PointSeries in a 3D Chart.
 */
// Import LightningChartJS
const lcjs = require('@arction/lcjs')

// Extract required parts from LightningChartJS.
const {
    lightningChart,
    SolidFill,
    ColorRGBA,
    UIElementBuilders,
    UILayoutBuilders,
    Themes
} = lcjs

// Extract required parts from xyData.
const {
    createProgressiveRandomGenerator
} = require('@arction/xydata')

// Define colors
const red = new SolidFill({ color: ColorRGBA(255, 100, 100) })
const blue = new SolidFill({ color: ColorRGBA(100, 100, 255) })

// Initiate chart
const chart3D = lightningChart().Chart3D({
    // theme: Themes.dark
})
    .setTitle('3D Scatter Chart')

// Set Axis titles
chart3D.getDefaultAxisX().setTitle('Axis X')
chart3D.getDefaultAxisY().setTitle('Axis Y')
chart3D.getDefaultAxisZ().setTitle('Axis Z')

// Create two new Point Series
const blueSeries = chart3D.addPointSeries({ pointShape: 'sphere' })
    .setPointStyle((pointStyle) => pointStyle
        // Change the point fillStyle.
        .setFillStyle(blue)
        // Change point size.
        .setSize(30))
const redSeries = chart3D.addPointSeries({ pointShape: 'sphere' })
    .setPointStyle((pointStyle) => pointStyle
        .setFillStyle(red)
        .setSize(30))

// Add layout UI Element for checkboxes.
const layout = chart3D.addUIElement(UILayoutBuilders.Column)
    .setPosition({ x: 90, y: 90 })
    .setOrigin({ x: 1, y: 1 })

// Flag for camera rotation
let rotateCamera = false
// Add button for toggling camera rotation into the layout UI Element
const rotateCameraButton = layout.addElement(UIElementBuilders.CheckBox)
    .setText('Rotate camera')
rotateCameraButton.onSwitch((_, state) => {
    rotateCamera = state
})
rotateCameraButton.setOn(rotateCamera)

// Method to handle animating camera rotation.
let cameraAngle = 0
const dist = 1
const animateCameraRotation = () => {
    if (rotateCamera) {
        chart3D.setCameraLocation(
            {
                x: Math.cos(cameraAngle) * dist,
                y: 0.50,
                z: Math.sin(cameraAngle) * dist
            }
        )
        cameraAngle += 0.005
    }
    requestAnimationFrame(animateCameraRotation)
}
animateCameraRotation()

// Generate points for the red series.
createProgressiveRandomGenerator()
    .setNumberOfPoints(30)
    .generate()
    .toPromise()
    .then((d) => d.map((p) => ({
        x: p.x - 1,
        y: p.y * 1,
        z: Math.random()
    })))
    .then((d) => {
        setInterval(() => {
            redSeries.add(d.splice(0, 10))

        })
    })

// Generate points for the blue series.
createProgressiveRandomGenerator()
    .setNumberOfPoints(30)
    .generate()
    .toPromise()
    .then((d) => d.map((p) => ({
        x: p.x - 1,
        y: p.y * 1,
        z: Math.random()
    })))
    .then((d) => {
        setInterval(() => {
            blueSeries.add(d.splice(0, 10))

        })
    })
