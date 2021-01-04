const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const app = express();

morgan.token('body', function (req, res) { return JSON.stringify(req.body) })
app.use(express.static('build'))
app.use(cors())
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

let persons = [
    {
        "name": "Arto Hellas",
        "number": "040-123456",
        "id": 1
    },
    {
        "name": "Ada Lovelace",
        "number": "39-44-5323523",
        "id": 2
    },
    {
        "name": "Dan Abramov",
        "number": "12-43-234345",
        "id": 3
    },
    {
        "name": "Mary Poppendieck",
        "number": "39-23-6423122",
        "id": 4
    }
];

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(p => p.id === id)
    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(p => p.id !== id)
  
    response.status(204).end()
})

const generateId = () => Math.floor(Math.random() * 100) + 1;
  
app.post('/api/persons', (request, response) => {
    const body = request.body
    console.log(request.body);
  
    if (!body.name || !body.number) {
        return response.status(400).json({ 
            error: 'The name or number is missing' 
        })
    }

    const existingPerson = persons.find(p => p.name === body.name);
    if(existingPerson){
        return response.status(400).json({ 
            error: 'The name must be unique' 
        })
    }
  
    const person = {
        id: generateId(),
        name: body.name,
        number: body.number,
        date: new Date()
    }
  
    persons = persons.concat(person)
  
    response.json(person)
})

app.get('/info', (request, response) => {
    const now = new Date();
    response.send(`<p>Phonebook has info for ${persons.length} people</p><p>${now.toString()}</p>`)
})

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})