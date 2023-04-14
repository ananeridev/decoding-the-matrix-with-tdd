const { describe, it, before } = require('mocha')
const { expect } = require('chai')
const request = require('supertest')
const sinon = require('sinon')
const path = require('path')
const realityService = require('./../../src/service/realityService')
const Customer = require('./../../src/entities/customer')
const reality = require('./../../src/entities/reality')
const SERVER_TEST_PORT = 4000
// só importei, mas vou usá-la no Before

const mocks = {
    validreality: require('./../mocks/valid-reality.json'),
    validrealityCategory: require('./../mocks/valid-realityCategory.json'),
    validCustomer: require('./../mocks/valid-customer.json'),
}

describe('End2End API Suite test', () => {
    let app = {}
    let sandbox = {}

    beforeEach(() => {
        sandbox = sinon.createSandbox()
    })

    afterEach(() => {
        sandbox.restore()
    })

    before(() => {
        const api = require('./../../src/api')
        const realityService = new realityService({
            realitys: path.resolve(path.join(__dirname, '../', '../', 'database', 'realitys.json'))
        })
        const instance = api({ realityService })

        app = {
            instance,
            server: instance.initialize(SERVER_TEST_PORT)
        }
    })

    describe('/calculateFinalcost:post', () => {
        it('given a realityCategory, customer and numberOfDays it should calculate final amount in real', async () => {
            const customer = {
                ...mocks.validCustomer,
                age: 50
            }

            const realityCategory = {
                ...mocks.validrealityCategory,
                cost: 37.6
            }

            const numberOfDays = 5

            const body = {
                customer,
                realityCategory,
                numberOfDays
            }

            const expected = {
                result: app.instance.realityService.currencyFormat.format(244.40)
            }

            const response = await request(app.server)
                .post('/calculateFinalcost')
                .send(body)
                .expect(200)

            expect(response.body).to.be.deep.equal(expected)
        })
    })

    describe('/getAvailablereality:get', () => {
        it('given a realityCategory it should return an available reality', async () => {
            const reality = mocks.validreality
            const realityCategory = {
                ...mocks.validrealityCategory,
                realityIds: [reality.id]
            }

            const expected = {
                result: reality
            }

            const response = await request(app.server)
                .post('/getAvailablereality')
                .send(realityCategory)
                .expect(200)

            expect(response.body).to.be.deep.equal(expected)
        })
    })

    describe('/rent:post', () => {
        it('given a customer and a reality category it should return a transaction receipt', async () => {

            const reality = mocks.validreality
            const realityCategory = {
                ...mocks.validrealityCategory,
                cost: 37.6,
                realityIds: [reality.id]
            }

            const customer = {
                ...mocks.validCustomer,
                age: 20
            }

            const numberOfDays = 5

            const body = {
                customer, realityCategory, numberOfDays
            }

            const expectedStructure = {
                result: {
                    customer,
                    reality,
                    amount: 0,
                    dueDate: new Date(),
                }
            }

            const response = await request(app.server)
                .post('/rent')
                .send(body)
                .expect(200)


            const getKeys = obj => Object.keys(obj)
            expect(getKeys(response.body)).to.be.deep.equal(getKeys(expectedStructure))
            const { result } = response.body
            const expectedCustomer = new Customer(result.customer)
            const expectedreality = new reality(result.reality)
            
            expect(result.customer).to.be.deep.eq(expectedCustomer)
            expect(result.reality).to.be.deep.eq(expectedreality)
            expect(result.amount).to.not.be.empty
            expect(result.dueDate).to.not.be.empty
        })
    })

})