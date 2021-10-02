const express = require('express');
const appName = 'web-feirinha-bar';
const app = express();

const PORT = process.env.PORT || 8080
const outputPath = `${__dirname}/dist/${appName}`

app.use(express.static(outputPath));

app.get('/*', (req, res) => {
    res.sendFile(outputPath + '/index.html');
})

app.listen(PORT, () => {
    console.log('Servidor iniciado na porta ' + PORT);
})