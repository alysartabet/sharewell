/** Imports app and calls listen */
const app = require("./app");

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Sharewell backend listening on port ${PORT}`);
});


/*If anything breaks I'll run:
node -v
npm -v
ls
cat package.json

in the terminal
*/