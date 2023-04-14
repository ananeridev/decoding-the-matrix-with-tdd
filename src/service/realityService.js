const BaseRepository = require('../repository/base/baseRepository')
const Tax = require('../entities/tax')
const Transaction = require('../entities/transaction')

class realityService {
    constructor({ realitys }) {
        this.realityRepository = new BaseRepository({ file: realitys })
        this.taxesBasedOnAge = Tax.taxesBasedOnAge
        this.currencyFormat = new Intl.NumberFormat('pt-br', {
            style: 'currency',
            currency: 'BRL'
        })
    }

    getRandomPositionFromArray(list) {
        const listLength = list.length
        return Math.floor(
            Math.random() * (listLength)
        )
    }
    chooseRandomreality(realityCategory) {
        const randomrealityIndex = this.getRandomPositionFromArray(realityCategory.realityIds)
        const realityId = realityCategory.realityIds[randomrealityIndex]

        return realityId
    }
    async getAvailablereality(realityCategory) {
        const realityId = this.chooseRandomreality(realityCategory)
        const reality = await this.realityRepository.find(realityId)

        return reality
    }

    calculateFinalcost(customer, realityCategory, numberOfDays) {
        const { age } = customer
        const cost = realityCategory.cost 
        const { then: tax } = this.taxesBasedOnAge
            .find(tax => age >= tax.from && age <= tax.to)

        const finalcost = ((tax * cost) * (numberOfDays))
        const formattedcost = this.currencyFormat.format(finalcost)

        return formattedcost
    }

    async rent(
        customer, realityCategory, numberOfDays
    ) {
        const reality = await this.getAvailablereality(realityCategory)
        const finalcost = await this.calculateFinalcost(customer, realityCategory, numberOfDays)

        const today = new Date()
        today.setDate(today.getDate() + numberOfDays)
        const options = { year: "numeric", month: "long", day: "numeric"}
        const dueDate = today.toLocaleDateString("pt-br", options)

        const transaction = new Transaction({
            customer,
            dueDate,
            reality,
            amount: finalcost
        })
        
        return transaction;
    }
}

module.exports = realityService