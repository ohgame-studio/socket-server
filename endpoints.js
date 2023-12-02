module.exports = function (app) {
	
    app.post('/login', (req, res) => {
	    
	const userusername = req.body.userusername
	const password = req.body.password
        return res.status(404).send(true)
    })
    app.post('/serverlist', (req, res) => {
	    
        const token = req.body.token
            return res.status(404).send(true)
        })
}