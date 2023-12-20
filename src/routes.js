import { Database } from "./database.js"
import { randomUUID } from "node:crypto";
import { buildRoutePath } from "./utils/build-route-path.js";

const database = new Database

export const routes = [
    {
        method: 'GET',
        path: buildRoutePath('/tasks'),
        handler: (req, res) => {
            const { search } = req.query

            const tasks = database.select('tasks', {
                title: search,
                description: search
            })

            return res.end(JSON.stringify(tasks))
        }
    },
    {
        method: 'POST',
        path: buildRoutePath('/tasks'),
        handler: (req, res) => {
            const { title, description } = req.body
            const dateTime = new Date().toLocaleString()

            const task = {
                id: randomUUID(),
                title: title,
                description: description,
                completed_at: null,
                created_at: dateTime,
                updated_at: dateTime

            }

            database.insert('tasks', task)

            return res.writeHead(201).end()
        }
    },
    {
        method: 'PUT',
        path: buildRoutePath('/tasks/:id'),
        handler: (req, res) => {
            const { id } = req.params
            const { title, description, completed_at } = req.body
            const dateTime = new Date().toLocaleString()

            database.update('tasks', id, {
                title,
                description,
                completed_at,
                updated_at: dateTime
            })
            
            return res.writeHead(204).end()
        }
    },
    {
        method: 'DELETE',
        path: buildRoutePath('/tasks/:id'),
        handler: (req, res) => {
            const { id } = req.params
            
            database.delete('tasks', id)
            
            return res.writeHead(204).end()
        }
    },
    {
        method: 'PATCH',
        path: buildRoutePath('/tasks/:id/complete'),
        handler: (req, res) => {
            const { id } = req.params
            const { completed_at } = req.body
            const dateTime = new Date().toLocaleString()

            var completedOrNot = false ? null : dateTime

            database.patch('tasks', id, {
                completed_at: completedOrNot,
            })
            
            return res.writeHead(204).end()
        }
    }
]