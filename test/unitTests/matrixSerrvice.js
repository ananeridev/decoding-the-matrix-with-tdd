const { describe, it, before, beforeEach, afterEach } = require('mocha')
const realityService = require('./../../src/service/realityService')
const Transaction = require('../../src/entities/transaction')

const { join } = require('path')
const { expect } = require('chai')
const sinon = require('sinon')

const realitysDatabase = join(__dirname, './../../database', "realitys.json")

const mocks = {
    validrealityCategory: require('./../mocks/valid-realityCategory.json'),
    validreality: require('../mocks/valid-reality.json'),
    validCustomer: require('../mocks/valid-customer.json'),
}

describe('Matrix realityService Suite Tests', () => {
    let realityService = {}
    let sandbox = {}
    before(() => {
        realityService = new realityService({
            realitys: realitysDatabase
        })
    })
    beforeEach(() => {
        sandbox = sinon.createSandbox()
    })

    afterEach(() => {
        sandbox.restore()
    })

    it('should retrieve a random position from an array', () => {
        const data = [0, 1, 2, 3, 4]
        const result = realityService.getRandomPositionFromArray(data)

        expect(result).to.be.lte(data.length).and.be.gte(0)
    })

    it('should choose the first id from realityIds in realityCategory', () => {
        const realityCategory = mocks.validrealityCategory
        const realityIdIndex = 0

        sandbox.stub(
            realityService,
            realityService.getRandomPositionFromArray.name
        ).returns(realityIdIndex)


        const result = realityService.chooseRandomreality(realityCategory)
        const expected = realityCategory.realityIds[realityIdIndex]
        
        expect(realityService.getRandomPositionFromArray.calledOnce).to.be.ok
        expect(result).to.be.equal(expected)
    })

    it('given a realityCategory it should return an available reality', async () => {
        const reality = mocks.validreality
        const realityCategory = Object.create(mocks.validrealityCategory)
        realityCategory.realityIds = [reality.id]
        
        sandbox.stub(
            realityService.realityRepository,
            realityService.realityRepository.find.name,
        ).resolves(reality)

        sandbox.spy(
            realityService,
            realityService.chooseRandomreality.name,
        )
        

        const result = await realityService.getAvailablereality(realityCategory)
        const expected = reality
        
        expect(realityService.chooseRandomreality.calledOnce).to.be.ok
        expect(realityService.realityRepository.find.calledWithExactly(reality.id)).to.be.ok
        expect(result).to.be.deep.equal(expected)
    })

    it('given a realityCategory, customer and numberOfDays it should calculate final amount in real', async() => {
        const customer = Object.create(mocks.validCustomer)
        customer.age = 50

        const realityCategory = Object.create(mocks.validrealityCategory)
        realityCategory.cost = 37.6

        const numberOfDays = 5


        sandbox.stub(
            realityService,
            "taxesBasedOnAge"
        ).get(() => [{ from: 40, to: 50, then: 1.3 }])
        
        const expected = realityService.currencyFormat.format(244.40)
        const result = realityService.calculateFinalcost(
            customer,
            realityCategory,
            numberOfDays
        )

        expect(result).to.be.deep.equal(expected)
    })

    it('given a customer and a reality category it should return a transaction receipt', async () => {
        const reality = mocks.validreality
        const realityCategory = {
            ...mocks.validrealityCategory,
            cost: 37.6,
            realityIds: [reality.id]
        }
        
        const customer = Object.create(mocks.validCustomer)
        customer.age = 20

        const numberOfDays = 5
        const dueDate = "10 de novembro de 2020"
        
        const now = new Date(2020, 10, 5)
        sandbox.useFakeTimers(now.getTime())

        sandbox.stub(
            realityService.realityRepository,
            realityService.realityRepository.find.name,
        ).resolves(reality)
        
        const expectedAmount = realityService.currencyFormat.format(206.80)
        const result = await realityService.rent(
            customer, realityCategory, numberOfDays
        )
        const expected = new Transaction({
            customer,
            reality,
            dueDate,
            amount: expectedAmount,
        })

        expect(result).to.be.deep.equal(expected)
        
    })
})