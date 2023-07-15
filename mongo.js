const { ConnectionPoolMonitoringEvent } = require('mongodb')
const mongoose = require('mongoose')

if(process.argv.length < 3){
    console.log('password missing from arguments..')
    process.exit()
}

const password = process.argv[2]
const url = `mongodb+srv://fullstack:${password}@cluster0.kl146m1.mongodb.net/noteApp?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personShema = new mongoose.Schema({
    id : Number,
    name : String,
    number : String
})

const Person = mongoose.model('Person', personShema)

if(process.argv.length < 5){
    Person.find({}).then(result => {
        console.log(result)
        mongoose.connection.close()
    })
}

else{
    const name = process.argv[3]
    const number = process.argv[4]

    const person = new Person({
        name: name,
        number: number
    })

    person.save().then(res => {
        console.log(`added ${name} number ${number} to phonebook`)
        mongoose.connection.close()
    })
}