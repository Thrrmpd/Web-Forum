const express = require('express')
const mongoose = require('mongoose')
const cor = require('cor')
const mult = require('multer')

const app = express()
app.use(cor())
app.use(express.json())

