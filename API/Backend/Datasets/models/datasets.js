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
const Datasets = sequelize.define('datasets', attributes, options)

function makeNewDatasetTable (name, columns, success, failure) {
  name = name.replace(/[`~!@#$%^&*()|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '') // eslint-disable-line no-useless-escape

  const attributes = {}

  columns.forEach((element) => {
    attributes[element] = {
      type: Sequelize.STRING,
      unique: false,
      allowNull: true
    }
  })

  const options = {
    timestamps: false
  }

  Datasets.findOne({ where: { name } })
    .then((result) => {
      if (result) {
        const DatasetTable = sequelize.define(
          result.dataValues.table,
          attributes,
          options
        )
        Datasets.update(
          { updatedAt: new Date().toISOString() },
          { where: { name }, silent: true }
        )
          .then((r) => {
            success({
              name: result.dataValues.name,
              table: result.dataValues.table,
              tableObj: DatasetTable
            })

            return null
          })
          .catch((err) => {
            logger(
              'error',
              'Failed to update datasets.',
              'datasets',
              null,
              err
            )
            failure({
              status: 'failure',
              message: 'Failed to update datasets'
            })
          })
      } else {
        sequelize
          .query('SELECT COUNT(*) FROM datasets')
          .then(([results]) => {
            const newTable = 'd' + (parseInt(results[0].count) + 1) + '_datasets'
            Datasets.create({
              name,
              table: newTable
            })
              .then((created) => {
                const DatasetTable = sequelize.define(
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
                      tableObj: DatasetTable
                    })
                    return null
                  })
                  .catch((err) => {
                    logger(
                      'error',
                      'Failed to sync dataset table.',
                      'datasets',
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
                  'Failed to create dataset table.',
                  'datasets',
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
              'Failed to count existing datasets.',
              'datasets',
              null,
              err
            )
            failure({
              status: 'failure',
              message: 'Failed to count existing datasets'
            })
          })
      }

      return null
    })
    .catch((err) => {
      logger(
        'error',
        'Failed to find existing datasets.',
        'datasets',
        null,
        err
      )
      failure({
        status: 'failure',
        message: 'Failed to find existing datasets',
        error: err,
        name
      })
    })
}

// export User model for use in other files.
module.exports = {
  Datasets,
  makeNewDatasetTable
}
