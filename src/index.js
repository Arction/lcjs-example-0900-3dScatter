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
    PointStyle3D,
    Themes
} = lcjs

// Extract required parts from xyData.
const {
    createWaterDropDataGenerator
} = require('@arction/xydata')

// Initiate chart
const chart3D = lightningChart().Chart3D({
    disableAnimations: true,
    // theme: Themes.darkGold
})
    .setTitle('3D Scatter Chart')

// Set Axis titles
chart3D.getDefaultAxisX().setTitle('Axis X')
chart3D.getDefaultAxisY().setTitle('Axis Y')
chart3D.getDefaultAxisZ().setTitle('Axis Z')

// Create Point Series for rendering max Y coords.
const pointSeriesMaxCoords = chart3D.addPointSeries()
    .setPointStyle(new PointStyle3D.Triangulated({
        fillStyle: new SolidFill({ color: ColorRGBA(224, 152, 0) }),
        size: 10,
        shape: 'sphere'
    }))
    .setName('Max coords')

// Create another Point Series for rendering other Y coords than Max.
const pointSeriesOtherCoords = chart3D.addPointSeries()
    .setPointStyle(new PointStyle3D.Triangulated({
        fillStyle: new SolidFill({ color: ColorRGBA(255, 0, 0) }),
        size: 5,
        shape: 'cube'
    }))
    .setName('Below Max')

// Add LegendBox to chart.
chart3D.addLegendBox()
    // Dispose example UI elements automatically if they take too much space. This is to avoid bad UI on mobile / etc. devices.
    .setAutoDispose({
        type: 'max-width',
        maxWidth: 0.30,
    })
    .add(chart3D)

// Generate heatmap data for depicting amount of scattered points along the XZ plane.
let totalPointsAmount = 0
const rows = 40
const columns = 60
createWaterDropDataGenerator()
    .setRows( rows )
    .setColumns( columns )
    .generate()
    .then( data => {
        // 'data' is a number Matrix number[][], that can be read as data[row][column].
        for ( let row = 0; row < rows; row ++ ) {
            for ( let column = 0; column < columns; column ++ ) {
                const value = data[row][column]
                // Generate 'value' amount of points along this XZ coordinate,
                // with the Y coordinate range based on 'value'.
                const pointsAmount = Math.ceil( value / 100 )
                const yMin = 0
                const yMax = value
                for ( let iPoint = 0; iPoint < pointsAmount; iPoint ++ ) {
                    const y = yMin + Math.random() * (yMax - yMin)
                    pointSeriesOtherCoords.add({ x: row, z: column, y })
                    totalPointsAmount ++
                }
                pointSeriesMaxCoords.add({ x: row, z: column, y: yMax })
                totalPointsAmount ++
            }
        }

        chart3D.setTitle(chart3D.getTitle() + ` (${totalPointsAmount} data points)`)
        // Set explicit Y Axis interval.
        chart3D.getDefaultAxisY().setInterval(0, 150, 2000, true)
    })

