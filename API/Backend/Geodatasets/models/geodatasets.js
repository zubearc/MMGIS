/***********************************************************
 * Loading all required dependencies, libraries and packages
 **********************************************************/
const Sequelize = require('sequelize')
const { sequelize } = require('../../../connection')
const logger = require('../../../logger')

const attributes = {
  name: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false
  },
  table: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false
  }
}

const options = {
  timestamps: true
}

// setup User model and its fields.
const Geodatasets = sequelize.define('geodatasets', attributes, options)

function makeNewGeodatasetTable (name, success, failure) {
  name = name.replace(/[`~!@#$%^&*()|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '') // eslint-disable-line no-useless-escape

  const attributes = {
    properties: {
      type: Sequelize.JSON,
      allowNull: true,
      defaultValue: {}
    },
    geometry_type: {
      type: Sequelize.STRING,
      unique: false,
      allowNull: false
    },
    geom: {
      type: Sequelize.GEOMETRY,
      allowNull: true
    }
  }

  const options = {
    timestamps: false
  }

  Geodatasets.findOne({ where: { name } })
    .then((result) => {
      if (result) {
        const GeodatasetTable = sequelize.define(
          result.dataValues.table,
          attributes,
          options
        )
        Geodatasets.update(
          { updatedAt: new Date().toISOString() },
          { where: { name }, silent: true }
        )
          .then((r) => {
            success({
              name: result.dataValues.name,
              table: result.dataValues.table,
              tableObj: GeodatasetTable
            })

            return null
          })
          .catch((err) => {
            logger(
              'error',
              'Failed to update geodatasets.',
              'geodatasets',
              null,
              err
            )
            failure({
              status: 'failure',
              message: 'Failed to update geodatasets'
            })
          })
      } else {
        sequelize
          .query('SELECT COUNT(*) FROM geodatasets')
          .then(([results]) => {
            const newTable =
              'g' + (parseInt(results[0].count) + 1) + '_geodatasets'
            Geodatasets.create({
              name,
              table: newTable
            })
              .then((created) => {
                const GeodatasetTable = sequelize.define(
                  newTable,
                  attributes,
                  options
                )
                sequelize
                  .sync()
                  .then(() => {
                    success({
                      name,
                      table: newTable,
                      tableObj: GeodatasetTable
                    })
                    return null
                  })
                  .catch((err) => {
                    logger(
                      'error',
                      'Failed to sync geodataset table.',
                      'geodatasets',
                      null,
                      err
                    )
                    failure({
                      status: 'failure',
                      message: 'Failed to sync'
                    })
                  })

                return null
              })
              .catch((err) => {
                logger(
                  'error',
                  'Failed to create geodataset table.',
                  'geodatasets',
                  null,
                  err
                )
                failure({
                  status: 'failure',
                  message: 'Failed to create'
                })
              })
            return null
          })
          .catch((err) => {
            logger(
              'error',
              'Failed to count existing geodatasets.',
              'geodatasets',
              null,
              err
            )
            failure({
              status: 'failure',
              message: 'Failed to count existing geodatasets'
            })
          })
      }

      return null
    })
    .catch((err) => {
      logger(
        'error',
        'Failed to find existing geodatasets.',
        'geodatasets',
        null,
        err
      )
      failure({
        status: 'failure',
        message: 'Failed to find existing geodatasets',
        error: err,
        name
      })
    })
}

// export User model for use in other files.
module.exports = {
  Geodatasets,
  makeNewGeodatasetTable
}
