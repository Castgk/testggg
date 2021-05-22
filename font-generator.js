const TextToSVG = require('text-to-svg')
const fs = require('fs')

const DEF_OPTIONS = {
  x: 150,
  y: 150,
  fontSize: 100,
  anchor: 'center middle',
  maxWidth: 250,
  maxHeight: 130,
}

const generateTextSvgPath = (text, fontName, opts) => {
  let path = ''
  if (fontName.indexOf('.ttf') >= 0) {
    path = `./fonts/${fontName}`
  } else if (fontName.indexOf('.otf') >= 0) {
    path = `./fonts/${fontName}`
  } else {
    if (fs.existsSync(`./fonts/${fontName}.ttf`)) {
      path = `./fonts/${fontName}.ttf`
    } else if (fs.existsSync(`./fonts/${fontName}.otf`)) {
      path = `./fonts/${fontName}.otf`
    }
  }

  // console.log('[' + fontName + ']')
  // console.log('[' + path + ']')
  const textToSVG = TextToSVG.loadSync(path)
  // console.log('-----------')

  const options = { ...DEF_OPTIONS, ...opts }

  let metrics = textToSVG.getMetrics(text, options)
  while (metrics.width > options.maxWidth || metrics.height > options.maxHeight) {
    // console.log(`Too wide (font size: ${options.fontSize})`)
    options.fontSize--
    metrics = textToSVG.getMetrics(text, options)
  }

  return `<g>${textToSVG.getPath(text, options)}</g>`
}

module.exports = {
  generateTextSvgPath,
}
