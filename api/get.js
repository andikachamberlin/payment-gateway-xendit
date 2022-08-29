/*------------------------------------------------------------------
[Node Module]
-------------------------------------------------------------------*/
const express = require('express');
const router = express.Router();
const url = require('url');
const axios = require('axios');
/*------------------------------------------------------------------
[Node Module]
-------------------------------------------------------------------*/
router.get('/', (request, response) => {

    let get = url.parse(request.url, true);

    if (get.pathname == "/" && request.method === "GET") {

        let action = get.query.action; console.log('action : ', action);

        if (action === 'balance') {

            let config = {
                method: 'get',
                url: 'https://api.xendit.co/balance',
                headers: {
                    'Authorization': `Basic ${process.env.ENV_PAYMENT_KEY}`,
                }
            };

            axios(config)
                .then((result) => {
                    console.log('result', result.data)
                    response.json(result.data)
                })
                .catch((error) => {
                    console.log('error', error.message)
                    response.json(error.message)
                });

        } else if (action === 'get_invoice') {

            let id_invoice = get.query.id_invoice; console.log('id_invoice : ', id_invoice);

            let config = {
                method: 'get',
                url: `https://api.xendit.co/v2/invoices/${id_invoice}`,
                headers: {
                    'Authorization': `Basic ${process.env.ENV_PAYMENT_KEY}`,
                }
            };

            axios(config)
                .then((result) => {
                    console.log('result', result.data)
                    response.json(result.data)
                })
                .catch((error) => {
                    console.log('error', error.message)
                    response.json(error.message)
                });

        } else if (action === 'list_disbursement_bank') {

            let config = {
                method: 'get',
                url: 'https://api.xendit.co/available_disbursements_banks',
                headers: {
                    'Authorization': `Basic ${process.env.ENV_PAYMENT_KEY}`,
                }
            };

            axios(config)
                .then((result) => {
                    console.log('result', result.data)
                    response.json(result.data)
                })
                .catch((error) => {
                    console.log('error', error.message)
                    response.json(error.message)
                });

        } else if (action === 'get_disbursement') {

            let id_disbursement = get.query.id_disbursement; console.log('id_disbursement : ', id_disbursement);

            let config = {
                method: 'get',
                url: `https://api.xendit.co/disbursements/${id_disbursement}`,
                headers: {
                    'Authorization': `Basic ${process.env.ENV_PAYMENT_KEY}`,
                }
            };

            axios(config)
                .then((result) => {
                    console.log('result', result.data)
                    response.json(result.data)
                })
                .catch((error) => {
                    console.log('error', error.message)
                    response.json(error.message)
                });

        } else {

            response.json({
                error: 'Action Denied'
            })
        }

    } else {

        response.json({
            error: 'Error Get'
        })

    }

});

module.exports = router;