const mongoose = require('mongoose')

const password = "newpass"
const url = process.env.MONGODB_URI

mongoose.set('strictQuery', false)
mongoose.connect(url)
    .then(result => {
        console.log('connected to MongoDB')
    })
    .catch((error) => {
        console.log('error connecting to MongoDB:',
        error.message)
    })

const personSchema = new mongoose.Schema({
    id: Number,
    name: {
        type: String,
        minLength: 2,
        required: true
    },
    number: {
        type: String,
        minLength: 6,
        required: true
    }
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Person', personSchema)