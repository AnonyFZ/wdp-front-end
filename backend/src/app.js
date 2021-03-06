import 'babel-polyfill'
import cv from 'opencv4nodejs'
import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import functions from './functions'
import fs from 'fs'
import path from 'path'
import rimraf from 'rimraf'
import fileUpload from 'express-fileupload'
import { uploadFile, processFilesPath, uploadFilesPath, processFile } from './imagePath'

const PORT = process.env.PORT || 1412
const app = express()
const router = express.Router()
const generate404 = ({ method, originalUrl }) => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Error</title>
</head>
<body>
<pre>Cannot ${method} ${originalUrl}</pre>
</body>
</html>`
}

app
  .use(cors())
  .use(bodyParser.urlencoded({ extended: false }))
  .use(bodyParser.json())
  .use(fileUpload())
  .use('/editor/', express.static('dist', {
    extensions: ['html']
  }))
  .use('/api', router)
  .listen(PORT)

router
  .route('/process')
  .post(async (req, res) => {
    const { id, type, files, settings } = req.body
    try {
      const fileId = await functions[type](req.body)

      res
        .status(200)
        .json({
          fileId
        })
    } catch (error) {
      console.error(error)
      res.sendStatus(400)
    }
  })

router
  .route('/upload')
  .post((req, res) => {
    try {
      if (!req.files) return res.sendStatus(400)

      const { name, mimetype, md5, mv } = req.files.file
      const fileIdResult = { fileId: md5 }
      const fileName = uploadFile(fileIdResult)

      if (!fs.existsSync(fileName)) mv(fileName)

      res.json(fileIdResult)
    } catch (err) {
      res.sendStatus(400)
    }
  })

router
  .route('/clear')
  .delete((req, res) => {
    const { helpme } = req.body

    if (helpme === 'please') {
      rimraf.sync(uploadFilesPath)
      rimraf.sync(processFilesPath)

      if (!fs.existsSync(uploadFilesPath)) fs.mkdirSync(uploadFilesPath)
      if (!fs.existsSync(processFilesPath)) fs.mkdirSync(processFilesPath)

      res.sendStatus(200)
    }

    res.status(404).send(generate404(req))
  })

router
  .route('/image/:id')
  .get((req, res) => {
    const { id } = req.params

    const queryData = {
      fileId: id
    }
    const upload = uploadFile(queryData)
    const process = processFile(queryData)

    if (fs.existsSync(upload)) {
      res.sendFile(upload)
      return
    }
    if (fs.existsSync(process)) {
      res.sendFile(process)
      return
    }

    res.sendStatus(400)
  })

router
  .route('/')
  .get((req, res) => {
    res.redirect('/editor')
  })

// default redirect
app
  .get('/', (req, res) => {
    res.redirect('/editor')
  })