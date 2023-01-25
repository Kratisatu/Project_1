const express = require('express');
const { resourceLimits } = require('worker_threads');
const router = express.Router();
const uuid = require('uuid');
const reimbursementDao = require('../dao/reimbursement_dao');

const jwtUtil = require('../utility/jwt_util');


//Submit Reimbursement Requests
router.post('/reimbursements', async (req, res) => {
    try {
        const authorizationHeader = req.headers.authorization;
        // "Bearer <token>"
        const token = authorizationHeader.split(" ")[1]; // access 2nd element at index 1
        // If token is invalid, it will enter the catch block
        const tokenPayload = await jwtUtil.verifyTokenAndReturnPayload(token);

        if (tokenPayload.role === 'employee') {
            // if employee, then add reimbursement
            await reimbursementDao.addReimbursement(tokenPayload.username, req.body.amount, req.body.description);
        
            res.statusCode = 201;
            res.send({
                "message": "Successfully added reimbursement"
            })
        } else {
            res.statusCode = 401; // 401 unauthorized
            res.send({
                "message": "You do not have the appropriate role of 'employee' to access this operation"
            })
        }
    } catch(err) {
        if (err.name === 'JsonWebTokenError') {
            res.statusCode = 400;
            res.send({
                "message": "Invalid JWT"
            })
        } else if (err.name === 'TypeError') {
            res.statusCode = 400;
            res.send({
                "message": "No Authorization header provided"
            });
        } else {
            res.statusCode = 500; // 500 internal server error
        }
    }
    
});

//View Reimbursement Ticket Submissions
router.get('/reimbursements', async (req, res) => {

    //try {
        const authorizationHeader = req.headers.authorization;
        // "Bearer <token>"
        const token = authorizationHeader.split(" ")[1]; // access 2nd element at index 1
        // If token is invalid, it will enter the catch block
        const tokenPayload = await jwtUtil.verifyTokenAndReturnPayload(token);

        if (tokenPayload.role === 'employee') {
            // if employee, then retrieve all employee's requests
            console.log('Query by employee');
               let data = await reimbursementDao.retrieveRequestsByUsername(tokenPayload.username);

               if (data===undefined){
                res.statusCode = 400;
                res.send({
                    "message": "No reimbursement tickets"
                })

               } else {
                res.statusCode = 201;
                res.send(data.Items);
               }

                

            } else if (tokenPayload.role === 'manager') {
            //if manager, then retrieve ALL reimbursement requests
            let data = await reimbursementDao.retrieveAllReimbursementRequests();
        
            res.statusCode = 201;
            res.send(data.Items);

        }

    }




);

router.get('/reimbursements/:id', async (req, res) => {
    // Using async-await
    try {
        let data = await reimbursementDao.retrieveReimbursementRequestById(req.body.reimbursement_id);

        if (data.Item) {
            
            res.send(data.Item);
        } else {
            res.statusCode = 404;
            res.send({
                "message": `Item with id ${req.params.id} does not exist`
            })
        }
    } catch (err) {
        res.statusCode = 500;
        res.send({
            "message": err
        });
    }


});

//Approve or Deny Requests
router.patch('/reimbursements/:id', async (req, res) => {

    //Check for Manager Authorization
    const authorizationHeader = req.headers.authorization;
    const token = authorizationHeader.split(" ")[1];
    const tokenPayload = await jwtUtil.verifyTokenAndReturnPayload(token);

    if (tokenPayload.role !== 'manager') {
        res.statusCode = 403;
        res.send({
            "message": "Invalid Token"            
        })

    } else {
        try {
            // Check if item exists and that request hasnt been Approved/Denied
            let data = await reimbursementDao.retrieveReimbursementRequestById(req.body.reimbursement_id);
            if (data.Item && data.Item.status==='Pending') {
                await reimbursementDao.updateStatus(req.body.reimbursement_id, req.body.status);
                res.send({
                    "message": `Successfully updated status of request with id ${req.body.reimbursement_id}`
                });
            } else {
                console.log(req.params.id)
                res.statusCode = 404;
                res.send({
                    "message": `Item does not exist with id ${req.body.reimbursement_id}`
                });
            }
        } catch (err) {
            res.statusCode = 500;
            res.send({
                "message": err
            });
        }
    }


});

router.get('/reimbursements/pending', async (req, res) => {

    //try {
        const authorizationHeader = req.headers.authorization;
        // "Bearer <token>"
        const token = authorizationHeader.split(" ")[1]; // access 2nd element at index 1
        // If token is invalid, it will enter the catch block
        const tokenPayload = await jwtUtil.verifyTokenAndReturnPayload(token);

        if (tokenPayload.role === 'employee') {
            // if employee, then retrieve all employee's requests
            console.log('Query by employee');
               let data = await reimbursementDao.retrieveRequestsByStatus(Pending);

               if (data===undefined){
                res.statusCode = 400;
                res.send({
                    "message": "No pending reimbursement tickets"
                })

               } else {
                res.statusCode = 201;
                res.send(data.Items);
               }

                

            } else if (tokenPayload.role === 'manager') {
            //if manager, then retrieve ALL reimbursement requests
            let data = await reimbursementDao.retrieveRequestsByStatus('Pending');
        
            res.statusCode = 201;
            res.send(data.Items);

        }

    }




);



module.exports = router;