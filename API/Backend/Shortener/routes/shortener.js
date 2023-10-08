/***********************************************************
 * JavaScript syntax format: ES5/ES6 - ECMAScript 2015
 * Loading all required dependencies, libraries and packages
 **********************************************************/
const express = require('express')
const router = express.Router()

const logger = require('../../../logger')
const us = require('../models/url_shortener')
const UrlShortener = us.UrlShortener
// const UrlShortener_s = us.sequelize

/**
 * Creates and saves a shortened url and returns it
 * @param url
 * @param text *optional*
 */
router.post('/shorten', function (req, res, next) {
  if (process.env.DISABLE_LINK_SHORTENER === 'true') {
    res.send({
      status: 'failure',
      message: "Won't shorten.",
      body: {}
    })
    return
  }

  let loop = 0
  const maxLoop = 20

  shorten()
  function shorten () {
    const short = Math.random()
      .toString(36)
      .substr(2, 5 + loop)

    const newUrlShortened = {
      full: encodeURIComponent(req.body.url),
      short,
      creator: req.user
    }

    UrlShortener.create(newUrlShortened)
      .then((created) => {
        res.send({
          status: 'success',
          message: 'Successfully shortened URL.',
          body: { url: short }
        })
      })
      .catch((err) => {
        if (
          loop < maxLoop &&
          Object.hasOwn(err, 'errors') &&
          err.errors[0] &&
          Object.hasOwn(err.errors[0], 'path') &&
          Object.hasOwn(err.errors[0], 'type')
        ) {
          loop++
          shorten()
        } else {
          logger('error', 'Failed to shorten URL.', req.originalUrl, req, err)
          res.send({
            status: 'failure',
            message: 'Failed to shorten URL.',
            body: {}
          })
        }
      })
  }
})

router.post('/expand', function (req, res, next) {
  UrlShortener.findOne({
    where: {
      short: req.body.short
    }
  }).then((url) => {
    if (!url) {
      logger('error', 'Failed to find short URL.', req.originalUrl, req)
      res.send({
        status: 'failure',
        message: 'Failure to find URL.',
        body: {}
      })
    } else {
      res.send({
        status: 'success',
        message: 'Successfully shortened URL.',
        body: { url: decodeURIComponent(url.full) }
      })
    }
  })
})

module.exports = router
