const express = require('express')
const fontSelector = require('./font-selector')
const fontGenerator = require('./font-generator')
const bodyParser = require('body-parser')
const fs = require('fs')
const API_PORT = require('./config.json').API_PORT
const colors = require('./dataset/colors.json')

const ICONS_DIR = __dirname + '/icons/'

const app = express()
app.use(bodyParser.json())

app.post('/get-colors', (req, res) => {
  res.status(200).json(colors)
})

app.post('/get-icons', (req, res) => {
  let icons = []
  fs.readdirSync(ICONS_DIR).forEach((fileName, number) => {
    const svg = fs.readFileSync(ICONS_DIR + fileName, 'utf-8')
    const name = fileName.split('.')[0]
    icons.push({ name, svg })
  })
  res.status(200).json(icons)
})

app.post('/get-recommended-fonts', (req, res) => {
  const { fontParams, variableParam, variableParamVariants, text } = req.body

  const response = variableParamVariants.map(value => {
    const params = { ...fontParams, [variableParam]: value }
    const font = fontSelector.getRecommendedFont(params, 1)[0]

    const svgContent = `<g>${fontGenerator.generateTextSvgPath(text, font.name)}</g>`
    const sample = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 300 300">${svgContent}</svg>`

    return { font, sample }
  })
  res.status(200).json(response)
})

/****************************** Генерация логотипов ***************************************/

function getRandomArrValue (array) {
  const index = Math.floor(Math.random() * array.length)
  return array[Math.min(index, array.length - 1)]
}

app.post('/generate-logos', (req, res) => {
  const { brandName, fontParams, colors, icons } = req.body

  // Берём ближайшие 10 шрифтов
  const fonts = fontSelector.getRecommendedFont(fontParams, 10)

  // Варианты иконки. Если иконки нет - то только один вариант
  const layouts = icons.length > 0
    ? ['text-only', 'icon-top', 'icon-left']
    : ['text-only']

  // Генерируем 90 логотипов
  const result = []
  for (let i = 0; i < 90; i++) {
    const font = getRandomArrValue(fonts)
    const colorsItem = getRandomArrValue(colors)
    const layout = getRandomArrValue(layouts)
    const icon = getRandomArrValue(icons) || null

    result.push(generateLogo({ brandName, font, colorsItem, layout, icon }))
  }

  res.status(200).json(result)
})

function generateLogo ({ brandName, font, colorsItem, layout, icon }) {
  const iconSvg = icon ? fs.readFileSync(ICONS_DIR + icon + '.svg', 'utf-8') : null
  const { set, gradientOnly } = colorsItem
  const [color1, color2] = set

  // Выбираем рандомную цветовую схему ('фон текст-иконка')
  const colorShemes = gradientOnly
    ? ['grad-text', 'grad-bg']
    : ['grad-text', 'grad-bg', 'simple', 'simple-revers']
  const colorScheme = getRandomArrValue(colorShemes)

  let background
  let textFill
  let defs = null
  switch (colorScheme) {
    case 'simple':
      background = color1
      textFill = color2
      break
    case 'simple-revers':
      background = color2
      textFill = color1
      break
    case 'grad-text': {
      background = 'white'

      const gradientId = 'line-gradient-' + '0123456789'.charAt(Math.floor(Math.random() * 10))
      const stop0 = `<stop offset="0%" stop-color="${color1}" stop-opacity="1"></stop>`
      const stop1 = `<stop offset="100%" stop-color="${color2}" stop-opacity="1"></stop>`
      const angle = Math.floor(Math.random() * 365)

      const textLineGradient = `<linearGradient gradientTransform="rotate(${angle})" id="${gradientId}">${stop0}${stop1}</linearGradient>`
      defs = `<defs>${textLineGradient}</defs>`

      textFill = `url(#${gradientId})`
      break
    }
    case 'grad-bg':
      const angle = Math.floor(Math.random() * 365)
      background = `linear-gradient(${angle}deg, ${color1}, ${color2})`
      textFill = 'white'
      break
  }

  let textPath
  let iconGroup = null

  switch (layout) {
    case 'text-only':
      textPath = fontGenerator.generateTextSvgPath(brandName, font.name, {})
      break

    case 'icon-top':
      textPath = fontGenerator.generateTextSvgPath(brandName, font.name, {
        anchor: 'center top',
        y: 150,
        maxWidth: 250,
        maxHeight: 80
      })
      iconGroup = `<g style="fill: ${textFill}; transform: translate(112px, 60px) scale(0.25)">${iconSvg}</g>`
      break

    case 'icon-left':
      textPath = fontGenerator.generateTextSvgPath(brandName, font.name, {
        anchor: 'right middle',
        x: 275,
        y: 150,
        maxWidth: 200,
      })
      iconGroup = `<g style="fill: ${textFill}; transform: translate(20px, 127px) scale(0.15)">${iconSvg}</g>`
      break

  }

  const textGroup = `<g style="fill: ${textFill}">${textPath}</g>`

  let svgContent =
    (defs ? defs : '') +
    textGroup +
    (icon ? iconGroup : '')

  return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 300 300" style="background: ${background}" >${svgContent}</svg>`
}

/****************************** / Генерация логотипов ***************************************/

// Отдаём собранный билд фронтенда
app.use(express.static(__dirname + '/frontend/dist'))

app.listen(API_PORT, () => {
  console.log('----------------------------------------------')
  console.log(' Server is up and running on port number ' + API_PORT)
  console.log('----------------------------------------------')
})
