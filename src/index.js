const express = require('express')

require('./db/mongoose')
const userRouter=require('./routes/Users')
const taskRouter=require('./routes/Tasks')

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)



app.listen(port,() => {
    console.log('Server is up on port ' + port)
})