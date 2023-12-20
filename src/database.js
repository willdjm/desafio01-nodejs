import fs  from "node:fs/promises";

const databasePath = new URL ('../db.json', import.meta.url)

export class Database {
    #database = {}

    constructor() {
        fs.readFile(databasePath, 'utf8')
            .then(data => {
                this.#database = JSON.parse(data)
            })
            .catch(() => {
                this.#persist()
            })
    }
    
    #persist() {
        fs.writeFile(databasePath, JSON.stringify(this.#database))
    }

    select(table, search) {
        let data = this.#database[table] ?? []

        if (search) {
            data = data.filter(row => {
                return Object.entries(search).some(([key, value]) =>{
                    if (!value) {
                        return true
                    }
                    return row[key].includes(value)
                })
            })
        }

        return data
    }

    insert(table, data) {
        if (Array.isArray(this.#database[table])) {
            this.#database[table].push(data)
        } else {
            this.#database[table] = [data]
        }

        this.#persist()

        return data
    }

    update(table, id, data) {
        const rowIndex = this.#database[table].findIndex(row => row.id === id)

        const recoverCreatedAt = this.#database[table][rowIndex].created_at

        if (rowIndex > -1) {
            this.#database[table][rowIndex] = {
                id, 
                ...data,
                created_at: recoverCreatedAt
                
            }
            this.#persist()
        }
    }

    delete(table, id) {
        const rowIndex = this.#database[table].findIndex(row => row.id === id)

        if (rowIndex > -1) {
            this.#database[table].splice(rowIndex,1)
            this.#persist()
        }
    }

    patch(table, id, data) {
        const rowIndex = this.#database[table].findIndex(row => row.id === id)

        const recoverTitle = this.#database[table][rowIndex].title
        const recoverDescription = this.#database[table][rowIndex].description
        const recoverCreatedAt = this.#database[table][rowIndex].created_at
        const recoverUpdatedAt = this.#database[table][rowIndex].updated_at

        if (rowIndex > -1) {
            this.#database[table][rowIndex] = {
                id, 
                title: recoverTitle,
                description: recoverDescription,
                ...data,
                created_at: recoverCreatedAt,
                updated_at: recoverUpdatedAt
                
            }
            this.#persist()
        }
    }
}