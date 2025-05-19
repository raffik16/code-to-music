import { randomUUID } from 'crypto'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  
  // In a real app, you'd save this to a database
  // For demo purposes, we'll just return a response
  const composition = {
    id: randomUUID(),
    title: body.title,
    code: body.code,
    date: body.date,
    createdAt: new Date().toISOString()
  }
  
  return composition
})