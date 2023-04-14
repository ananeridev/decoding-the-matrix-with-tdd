const http = require('http')
const realityService = require('./service/realityService')

const DEFAULT_PORT = 3000
const DEFAULT_HEADERS = {
    'Content-Type': 'application/json'
}
// criei uma factory default (poderia estar em outro arquivo)
const defaultFactory = () => ({
    realityService: new realityService({ realitys: './../database/realitys.json' })
})



class Api {
    constructor(dependencies = defaultFactory()) {
        this.realityService = dependencies.realityService
    }

    // transformei em uma funçao
    generateRoutes() {

        return {
            '/rent:post': async (request, response) => {
                for await (const data of request) {
                    try {
                        const { customer, realityCategory, numberOfDays } = JSON.parse(data)
                        // alguma validacao top aqui
                        const result = await this.realityService.rent(customer, realityCategory, numberOfDays)

                        response.writeHead(200, DEFAULT_HEADERS)

                        response.write(JSON.stringify({ result }))
                        response.end()

                    } catch (error) {
                        console.log('error', error)
                        response.writeHead(500, DEFAULT_HEADERS)
                        response.write(JSON.stringify({ error: 'Deu Ruim!' }))
                        response.end()
                    }
                }
            },
            '/calculateFinalcost:post': async (request, response) => {
                for await (const data of request) {
                    try {
                        const { customer, realityCategory, numberOfDays } = JSON.parse(data)
                        // alguma validacao top aqui
                        const result = await this.realityService.calculateFinalcost(customer, realityCategory, numberOfDays)

                        response.writeHead(200, DEFAULT_HEADERS)

                        response.write(JSON.stringify({ result }))
                        response.end()

                    } catch (error) {
                        console.log('error', error)
                        response.writeHead(500, DEFAULT_HEADERS)
                        response.write(JSON.stringify({ error: 'Deu Ruim!' }))
                        response.end()
                    }
                }
            },
            '/getAvailablereality:post': async (request, response) => {
                for await (const data of request) {
                    try {
                        const realityCategory = JSON.parse(data)
                        // alguma validacao top aqui

                        const result = await this.realityService.getAvailablereality(realityCategory)

                        response.writeHead(200, DEFAULT_HEADERS)

                        response.write(JSON.stringify({ result }))
                        response.end()

                    } catch (error) {
                        console.log('error', error)
                        response.writeHead(500, DEFAULT_HEADERS)
                        response.write(JSON.stringify({ error: 'Deu Ruim!' }))
                        response.end()
                    }
                }
            },
            default: (request, response) => {
                response.write(JSON.stringify({ success: 'Hello World!' }))
                return response.end();
            }
        }
    }



    handler(request, response) {
        const { url, method } = request
        const routeKey = `${url}:${method.toLowerCase()}`

        const routes = this.generateRoutes()
        const chosen = routes[routeKey] || routes.default

        response.writeHead(200, DEFAULT_HEADERS)

        return chosen(request, response)
    }

    // criei uma funcao, que recebe as dependencias ou usa a factoryDefault
    initialize(port = DEFAULT_PORT) {

        const app = http.createServer(this.handler.bind(this))
            .listen(port, _ => console.log('app running at', port))

        return app
    }

}

// adiciono NODE_ENV para teste (adicionado no Package.json)
if (process.env.NODE_ENV !== 'test') {
    const api = new Api()
    api.initialize()
}

module.exports = (dependencies) => new Api(dependencies)