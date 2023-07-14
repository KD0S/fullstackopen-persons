const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')

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


let persons = [
        {
          name: "Arto Hellas",
          number: "040-123456",
          id: 1
        },
        {
          name: "Ada Lovelace",
          number: "39-44-5323523",
          id: 2
        },
        {
          name: "Dan Abramov",
          number: "12-43-234345",
          id: 3
        },
        {
          name: "Mary Poppendieck",
          number: "39-23-6423122",
          id: 4
        }
    ]

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    
    const person = persons.find(
        person => person.id === id
    )

    if(!person) return response.status(404).end()

    response.json(person)
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})

app.post('/api/persons/', (request, response) => {
    const body = request.body

    if(!body.number || !body.name){
        return response.status(400).json({
            error: 'name or number missing'
        })
    }

    if(persons.find(person => person.name 
        === body.name)){
        return response.status(400).json({
        error: 'name must be unique'})
    }

    const person = {
        id : Math.ceil(Math.random()*100000),
        name : body.name,
        number : body.number,
    }

    persons = persons.concat(person)
    response.json(person)
})

app.get('/api/info', (request, response) => {
    const count = persons.length
    const time =  Date()
    response.send(`<p>Phonebook has info for ${count} people</p>
        <p> ${time} </p> `).end()
})

const PORT = 3001
app.listen(PORT, ()=>{
    console.log(`server listening on port ${PORT}`);
})