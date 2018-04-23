import cv from 'opencv4nodejs'
import path from 'path'
import { sayFileName, saveFile } from '../imagePath'

export default (data) => {
  return new Promise((resolve, reject) => {
    const fileName = sayFileName(data)
    const img = cv.imread(fileName)

    const { settings } = data
    const { kSizeWidth, kSizeHeight } = settings

    const size = new cv.Size(kSizeWidth, kSizeHeight)
    const blurImg = img.blur(size)

    resolve(saveFile(blurImg, 'test.png'))
  })
}
