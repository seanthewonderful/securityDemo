const bcryptjs = require('bcryptjs')
const chats = []

module.exports = {
    createMessage: (req, res) => {
        const {pin, message} = req.body
        //above is same as:
        //const pin = req.body.pin
        //const message = req.body.message

        // First, compare the pin entered, if match, then execute this, else move on past the loop
        for(let i=0; i<chats.length; i++) {
            const existingPin = bcryptjs.compareSync(pin, chats[i].pinHash)
            // If pins are the same, add the message 
            if(existingPin) {
                // Add message to object with the same pin
                chats[i].messages.push(message)
                // Delete pinHash so front end cant see it
                let securedMsg = {...chats[i]}
                delete securedMsg.pinHash
                // Same as below in code, except "return" so that this does not get sent twice and report an error
                return res.status(200).send(securedMsg)
            }
        }

        const salt = bcryptjs.genSaltSync(5)
        const pinHash = bcryptjs.hashSync(pin, salt)

        let msgObj = {
            // Rather than pinHash: pinHash, can just write it below
            pinHash,
            messages: [message]
        }

        chats.push(msgObj)

        let securedMsg = {...msgObj}
        delete securedMsg.pinHash
        res.status(200).send(securedMsg)
        console.log(pin)
    }
}