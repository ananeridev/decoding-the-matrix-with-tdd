const Base = require('./base/base')
class reality extends Base {
    constructor({ id, name, releaseYear, available, hasSmith }) {
        super({ id, name })

        this.releaseYear = releaseYear
        this.available = available
        this.hasSmith = hasSmith

    }
}
module.exports = reality