require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const Person = require('./models/Person')

const errorHandler = (error, request, response, next) => {
    console.log(error.message)

    if(error.name === 'CastError'){
        return response.status(400).send({error: 'malformatted id'})
    } else if (error.name === 'VadlidationError') {
        return response.status(400).json({error: error.message})
    }

    next(error)
}


app.use(express.json())
app.use(morgan((tokens, req, res)=>{
    return [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, 'content-length'), '-',
        tokens['response-time'](req, res), 'ms',
        JSON.stringify(req.body)
      ].join(' ')
}))
app.use(cors())
app.use(express.static('build'))
app.use(errorHandler)

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons =>{
        response.json(persons)
    })
})

app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id).then(
        person => {
            if (person) {
                response.json(person)
            } else {
                response.status(404).end()
            }
        }
    ).catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndRemove(request.params.id)
    .then(result => {
        response.status(204).end()
    })
    .catch(error => next(error))
})

app.post('/api/persons/', (request, response, next) => {
    const body = request.body

    const person = new Person({
        name : body.name,
        number : body.number,
    })
    
    person.save().then(savedPerson => {
        response.json(savedPerson)
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body

    const person = {
        name : body.name,
        number : body.number
    }

    Person.findByIdAndUpdate(request.params.id, person, 
        {new: true, runValidators: true, context: 'query'})
    .then(updatedPerson => {
        response.json(updatedPerson)
    })
    .catch(error => next(error))
})

app.get('/api/info', (request, response) => {
    const count = persons.length
    const time =  Date()
    response.send(`<p>Phonebook has info for ${count} people</p>
        <p> ${time} </p> `).end()
})

const PORT = process.env.PORT 
app.listen(PORT, ()=>{
    console.log(`server listening on port ${PORT}`);
})