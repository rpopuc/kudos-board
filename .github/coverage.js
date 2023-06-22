const threshold = {
  statements: 100,
  branches: 100,
  functions: 100,
  lines: 100
}

const fs = require('fs')
const coverage = JSON.parse(fs.readFileSync('.coverage/coverage-summary.json')).total
const failed = Object.keys(threshold).some(key => {
  return coverage[key].pct < threshold[key]
})
if (failed) {
  console.log("Failed!")
  console.log(coverage)
  process.exit(1)
} else {
  console.log("Coverage success!")
}
