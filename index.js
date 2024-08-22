const express = require('express')
const morgan = require('morgan')
const app = express()

const cors = require('cors')
app.use(cors())


let persons = [
  { 
    "id": "1",
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": "2",
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": "3",
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": "4",
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]

// const requestLogger = (request, response, next) => {
//   console.log('Method:', request.method)
//   console.log('Path:  ', request.path)
//   console.log('Body:  ', request.body)
//   console.log('---')
//   next()
// }

morgan.token('body', function (req, res) { return JSON.stringify(req.body) })

app.use(express.json())
// app.use(requestLogger);
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))


const infoNum = persons.length

const getId = () => {
  id = Math.floor(Math.random() * 10000000000)
  return id;
}


app.get('/info', (request, response) => {
  
  console.log(response.getHeader('Date'));
  response.send(`<p>Phonebook has info for ${infoNum} people<p><p>${Date.now()}<p>`)

  console.log(response.get('Date'));
})

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.post('/api/persons', (request, response) => {
  const person = request.body
  if (!person.name || !person.number) {
    return response.status(400).json({
      error: 'name or number missing'
    })
  }

  if (persons.find(p => p.name === person.name)) {
    return response.status(400).json({
      error: 'name already exists'
    })
  }

  person.id = getId();
  
  persons = persons.concat(person);

  response.json(person);
})

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const person = persons.find(p => p.id === id)
  if (person) {
    response.json(person)
  }
  else {
    response.status(404).end();
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id

  persons = persons.filter(p => p.id !== id)

  console.log('received delete request');
  
  response.status(204).end()
})



const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})