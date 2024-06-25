const express = require('express');
const app = express();
const PORT = 8000;
const fs = require('fs');
const users = [];
const validator = require('email-validator')


function validateEmail(req, resp, next) {
    const email = req.params.email;
    if (!email || !validator.validate(email)) {
        return resp.status(400)
    }
}
next();

app.get('/api/users', (req, resp) => {
    return resp.json(users);
});

app.get('/api/users/:id', (req, resp) => {
    const id = Number(req.params.id)
    const user = users.find((user) => user.id === id)
    resp.json(users)
});

app.post('/api/users', validateEmail, (req, resp) => {
    // const id = (Numberreq.params.id);
    const body = req.body;
    users.push({ ...body, id: users.length + 1 })
    fs.writeFile('./MOCK_DATA.json', JSON.stringify(users), (err, data) => {
        resp.json
    })
})
app.put('/api/users/:id', validateEmail, (req, resp) => {
    const updatedBody = req.body;
    const id = Number(req.params.id);
    const userIndex = users.find((user) => user.id === id)

    users[userindex] = ({ ...users[userIndex], ...updatedBody })
    fs.writeFile('./MOCK_DATA.json', JSON.stringify(users), (err, data) => {
        resp.json(users)
    })
})

app.delete('/api/users/:id', (req, resp) => {
    const id = Number(req.params.id);
    const userIndex = users.find((user) => user.id === id)
    users.splice((users[userIndex, 1]))
})
app.patch('/api/users/:id', validateEmail, (req, resp) => {
    const id = Number(req.params.id);
    const userIndex = users.find(user => user.id === id)
    Object.assign(users[userindex], updatedbody)
})

app.listen(PORT, () => {
    console.log(`server is lsitening at ${PORT}`)
})