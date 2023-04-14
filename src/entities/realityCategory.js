const Base = require('./base/base')
class realityCategory extends Base {
    constructor({ id, name, realityIds, cost }) {
        super({ id, name })
        
        this.realityIds = realityIds
        this.cost = cost
    }
}
module.exports = realityCategory