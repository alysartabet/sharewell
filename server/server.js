const express = require("express")
const cors = require("cors")
require("dotenv").config()

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

app.get("/", (req, res) => {
  res.send("API running ✅")
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

/*If anything breaks I'll run:
node -v
npm -v
ls
cat package.json

in the terminal
*/