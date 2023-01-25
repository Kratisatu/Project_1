const AWS = require('aws-sdk');
const { PerformanceNodeTiming } = require('perf_hooks');
const uuid = require('uuid');

AWS.config.update({
    region: "us-east-1"
})

const docClient = new AWS.DynamoDB.DocumentClient();

var reimbursements = 0;

//Add A New Reimbursement Request
function addReimbursement(username, amount, description){

    
    return docClient.put({
        TableName: 'reimbursements',
        Item: {
            "username": username,
            "amount": amount,
            "description": description,
            "status": "Pending",
            
            "reimbursement_id": uuid.v4()
        }
    }).promise();

}

// addReimbursement('Dawn', 23.00, 'gas').then((data) => {
//     console.log('Adding reimbursement successful')
// }).catch((err) => {
//     console.log("An error occured")
//     console.error(err);
// });

//Retrieve Reimbursement Requests By Status
function retrieveRequestsByStatus(status) {
    const params = {
        TableName: 'reimbursements',
        IndexName: 'status_index',
        KeyConditionExpression: '#s = :value',
        ExpressionAttributeNames: {
            '#s': 'status'
        },
        ExpressionAttributeValues: {
            ':value': status
        }
    }
    return docClient.query(params).promise();
}


// retrieveRequestsByStatus('Pending').then((data) => {
//         console.log('Requests by status successfully retrieved');
//         console.log(data);
//     }).catch((err) => {
//         console.log('An error occurred')
//         console.error(err);
//     })

function retrieveAllReimbursementRequests() {
    const params = {
        TableName: 'reimbursements'
    }

    return docClient.scan(params).promise();
}


function retrieveRequestsByUsername(username) {
    const params = {
        TableName: 'reimbursements',
        IndexName: 'username_index',
        KeyConditionExpression: '#s = :value',
        ExpressionAttributeNames: {
            '#s': 'username'
        },
        ExpressionAttributeValues: {
            ':value': username
        }
    }
    return docClient.query(params).promise();
}




function retrieveReimbursementRequestById(reimbursement_id) {
    const params = {
        TableName: 'reimbursements',
        Key: {
            "reimbursement_id": reimbursement_id
        }
    }

    return docClient.get(params).promise();
}

// retrieveReimbursementRequestById("3708f370-7d11-433a-8f86-3a38de871e0d").then((data) => {
//     console.log("Request by ID successful");
//     console.log(data);
// }) 

function updateStatus(reimbursement_id, newStatus) {
    const params = {
        TableName: 'reimbursements',
        Key: {
            reimbursement_id
        },
        UpdateExpression: 'set #n = :value',
        ExpressionAttributeNames: {
            '#n': 'status'
        },
        ExpressionAttributeValues: {
            ':value': newStatus
        }
    }

    return docClient.update(params).promise();
}

updateStatus("f4a0c9d0-6729-4345-96b7-400bd07dea52", "Denied")
updateStatus("53adf67f-0809-46a0-a929-67db545a2bf1", "Approved")


module.exports = {
    addReimbursement,
    retrieveRequestsByStatus,
    retrieveAllReimbursementRequests,
    retrieveRequestsByUsername,
    retrieveReimbursementRequestById,
    updateStatus
}