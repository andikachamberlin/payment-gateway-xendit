/*------------------------------------------------------------------
[Node Module]
-------------------------------------------------------------------*/
const express = require('express');
const router = express.Router();
const url = require('url');
const axios = require('axios');
const crypto = require("crypto");
const id = crypto.randomBytes(8).toString("hex");
const idempotency_key = crypto.randomBytes(8).toString("hex");
/*------------------------------------------------------------------
[Node Module]
-------------------------------------------------------------------*/

router.post('/', (request, response) => {

    let get = url.parse(request.url, true);

    if (get.pathname == "/" && request.method === "POST") {

        let action = request.body.action; console.log('action : ', action);

        if (action === 'invoice') {

            let data = JSON.stringify({
                "external_id": `database-id-${id}`,
                "amount": 100000,
                "payer_email": "customer@domain.com",
                "description": `Invoice Demo #${id}`,
                "success_redirect_url": "http://localhost:5000/success.html",
                "failure_redirect_url": "http://localhost:5000/failure.html"
            });

            let config = {
                method: 'post',
                url: 'https://api.xendit.co/v2/invoices',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Basic ${process.env.ENV_PAYMENT_KEY}`
                },
                data: data
            };

            axios(config)
                .then((result) => {
                    console.log('result', result.data)
                    response.json(result.data)
                })
                .catch((error) => {
                    console.log('error', error)
                    response.json(error.message)
                });

        } else if (action === 'disbursement') {

            let data = JSON.stringify({
                "external_id": `database-id-${id}`,
                "amount": 100000,
                "bank_code": "BCA",
                "account_holder_name": "Joe",
                "account_number": "1234567890",
                "description": "Disbursement from Postman",
                "email_to": [
                    "test+to@xendit.co"
                ]
            });

            let config = {
                method: 'post',
                url: 'https://api.xendit.co/disbursements',
                headers: {
                    'Content-Type': 'application/json',
                    'X-IDEMPOTENCY-KEY': idempotency_key,
                    'Authorization': `Basic ${process.env.ENV_PAYMENT_KEY}`,
                },
                data: data
            };

            axios(config)
                .then((result) => {
                    console.log('result', result.data)
                    response.json(result.data)
                })
                .catch((error) => {
                    console.log('error', error)
                    response.json(error.message)
                });

        } else if (action === 'disbursement_multiple') {

            let data = [
                {
                    "external_id": `database-id-${id}`,
                    "amount": 100000,
                    "bank_code": "BCA",
                    "account_holder_name": "Joe",
                    "account_number": "1234567890",
                    "description": "Disbursement from Postman",
                    "email_to": [
                        "test+to@xendit.co"
                    ]
                },
                {
                    "external_id": `database-id-${id}`,
                    "amount": 100000,
                    "bank_code": "BCA",
                    "account_holder_name": "Joe",
                    "account_number": "1234567890",
                    "description": "Disbursement from Postman",
                    "email_to": [
                        "test+to@xendit.co"
                    ]
                }
            ];

            data.map(async (item, index) => {

                let config = {
                    method: 'post',
                    url: 'https://api.xendit.co/disbursements',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-IDEMPOTENCY-KEY': crypto.randomBytes(16).toString("hex"),
                        'Authorization': `Basic ${process.env.ENV_PAYMENT_KEY}`,
                    },
                    data: JSON.stringify(item)
                };
    
                await axios(config)
                    .then((result) => {
                        console.log('result', result.data)
                        // insert database jika pembayaran berhasil
                    })
                    .catch((error) => {
                        console.log('error', error)
                        // insert database jika pembayaran error
                    });

                if(index + 1 === data.length){
                    response.json('Success')
                }

            })

        } else if (action === 'batch_disbursement') {

            let data = JSON.stringify({
                "reference": `gaji-karyawan-${new Date()}`,
                "disbursements": [
                    {
                        "amount": 200000,
                        "bank_code": "BCA",
                        "bank_account_name": "Fadlan",
                        "bank_account_number": "1234567890",
                        "description": "Batch Disbursement",
                        "external_id": "database-id-1",
                        "email_to": [
                            "test+to@xendit.co"
                        ]
                    },
                    {
                        "amount": 300000,
                        "bank_code": "MANDIRI",
                        "bank_account_name": "Lutfi",
                        "bank_account_number": "1234567891",
                        "description": "Batch Disbursement with email notifications",
                        "external_id": "database-id-2",
                        "email_to": [
                            "test+to@xendit.co"
                        ]
                    }
                ]
            });

            let config = {
                method: 'post',
                url: 'https://api.xendit.co/batch_disbursements',
                headers: {
                    'Content-Type': 'application/json',
                    'X-IDEMPOTENCY-KEY': idempotency_key,
                    'Authorization': `Basic ${process.env.ENV_PAYMENT_KEY}`,
                },
                data: data
            };

            axios(config)
                .then((result) => {
                    console.log('result', result.data)
                    response.json(result.data)
                })
                .catch((error) => {
                    console.log('error', error)
                    response.json(error.message)
                });

        } else {

            response.json({
                error: 'Action Denied'
            })
        }

    } else {

        response.json({
            error: 'Error Post'
        })

    }

});

module.exports = router;