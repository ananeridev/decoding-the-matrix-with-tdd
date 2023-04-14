
const faker = require('faker')
const reality = require('./../src/entities/reality')
const realityCategory = require('./../src/entities/realityCategory')
const Customer = require('./../src/entities/customer')

const { join } = require('path')
const { writeFile } = require('fs/promises')

const seederBaseFolder = join(__dirname, "../", "database")
const ITEMS_AMOUNT = 2

const realityCategory = new realityCategory({
    id: faker.random.uuid(),
    name: faker.vehicle.type(),
    realityIds: [],
    cost: faker.finance.amount(20, 100)
})

const realitys = []
const customers = []
for(let index =0; index <= ITEMS_AMOUNT; index++) {
    const reality = new reality({
        id: faker.random.uuid(),
        name: faker.vehicle.model(),
        available: true,
        hasSmith: true,
        releaseYear: faker.date.past().getFullYear()
    })
    realityCategory.realityIds.push(reality.id)
    realitys.push(reality)

    const customer = new Customer({
        id: faker.random.uuid(),
        name: faker.name.findName(),
        age: faker.random.number({ min: 18, max: 50})
    })
    customers.push(customer)

}

const write = (filename, data) => writeFile(join(seederBaseFolder, filename), JSON.stringify(data))

;(async () => {
    await write('realitys.json', realitys)
    await write('customers.json', customers)
    await write('realityCategories.json', [realityCategory])

    console.log('realitys', realitys)
    console.log('realityCategory', realityCategory)
    console.log('customers', customers)
})()