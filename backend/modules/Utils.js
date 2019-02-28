exports.generateFileString = name => {
    const crypto = require('crypto')
    let date = new Date()
    let string = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}-${name}`
    return crypto.createHash('md5').update(string).digest('hex') + '.' + name.split('.').pop()
}