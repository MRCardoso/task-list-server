const replaceCharacters = (html, content, title) => {
    while (content.indexOf("{") != -1 || content.indexOf("}") != -1) {
        content = content.replace(/\{/ig, '<').replace(/\}/ig, '>');
    }
    const { AWS, logoHeader, logoFooter, endpoint } = require('../.env')
    // https:///${AWS.uploadFolder}
    return html
        .replace(/\{title\}/ig, title)
        .replace(/\{appURL\}/ig, endpoint)
        .replace(/\{logo1\}/ig, (logoHeader ? `<img src="https://${AWS.Bucket}.${AWS.URL}/${logoHeader}" width="40">` : ''))
        .replace(/\{logo2\}/ig, (logoFooter ? `<img src="https://${AWS.Bucket}.${AWS.URL}/${logoFooter}" width="80">` : ''))
        .replace(/\{content\}/ig, content);
}

const template = (title, content) => {
    return new Promise((resolve, reject) => {
        require('fs').readFile('./mail/index.html', 'utf8', (err, value) => {
            if (err) {
                console.log({fileErr: err})
                return reject("Arquivo para template de email não encontrado");
            }
            resolve(replaceCharacters(value, content, title))
        })
    })
}

module.exports = template