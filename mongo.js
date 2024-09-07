const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

let addFlag = process.argv.length < 5 ? false : true;

const password = process.argv[2]

const url =
  `mongodb+srv://qupp:${password}@cluster0.kh5wb.mongodb.net/phonebook?retryWrites=true&w=majority`

mongoose.set('strictQuery',false)

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)


if (addFlag) {
  const person = new Person({
    name: process.argv[3],
    number: process.argv[4],
  })
  person.save().then(result => {
    console.log(`phone number of ${person.name} saved!`)
    mongoose.connection.close()
  })
}
else {
  console.log("Phonebook:")
  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(person.name, person.number)
    })
    mongoose.connection.close()
  })
}

