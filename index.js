require('dotenv').config()

const express = require('express')
const app = express()
app.use(express.static('dist'))

const cors = require('cors')
app.use(cors())


app.use(express.json())

const morgan = require('morgan')
morgan.token('body', function (req, res) { return JSON.stringify(req.body) })
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))


const Person = require('./models/person')


app.get('/info', (request, response, next) => {
  const date = new Date()
  Person.countDocuments({}).then(count => {
    console.log(`count is ${count}`)
    response.send(`<p>Phonebook has info for ${count} people<p><p>${date.toISOString()}<p>`)
  }).catch(e => next(e))
})

  app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
  })

  app.get('/api/persons', (request, response) => {
    console.log('In api/persons')
    Person.find({}).then(persons => {
      response.json(persons)
    })
  })

  app.post('/api/persons', (request, response, next) => {
    const body = request.body

    const person = new Person({
      name: body.name,
      number: body.number
    })
    person.save().then(savedPerson => {
      response.json(savedPerson)
    })
    .catch(e => next(e))
  })

  app.get('/api/persons/:id', (request, response, next) => {
    const id = request.params.id
    Person.findById(id)
      .then(person => {
        if (person) {
          response.json(person)
        }
        else {
          response.status(404).end()
        }
      })
      .catch(e => next(e))
  })

  app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndDelete(request.params.id)
      .then(res => {
        response.status(204).end()
      })
      .catch(e => next(e))
  })

  app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body
    const person = {
      name: body.name,
      number: body.number
    }

    Person.findByIdAndUpdate(request.params.id, person, { new: true })
      .then(updatedPerson => {
        response.json(updatedPerson)
      })
      .catch(e => next(e))
  })

  const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }
  app.use(unknownEndpoint)


  const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
      return response.status(400).send({ error: 'malformatted id' })
    }
    else if (error.name === 'ValidationError') {
      return response.status(400).send(error.message)
    }

    next(error)
  }

  // this has to be the last loaded middleware, also all the routes should be registered before this!
  app.use(errorHandler)

  const PORT = process.env.PORT || 3001
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })