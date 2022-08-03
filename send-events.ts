import { messages } from './messages'
import axios from 'axios'

async function main() {
    for (let i = 0; i < messages.length; i++) {
        const message = messages[i]
        let endpoint = 'shipment'
        if (message.type === 'ORGANIZATION') {
            endpoint = 'organization'
        }

        try {
            await axios.post(`http://localhost:3000/${endpoint}`, message)
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error(error.code)
        }
    }

    // eslint-disable-next-line no-console
    console.log('✅ All messages sent');
}

main()