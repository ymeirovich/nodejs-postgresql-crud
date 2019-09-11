const { Client } = require('pg');
var connectionString = "postgres://postgres:root@localhost:5432/dvdrental";

const client = new Client({
    connectionString: connectionString
});

client.connect();

exports.list = function(req, res) {

    client.query('SELECT * FROM customer', function(err, result) {
        if (err) {
            console.log(err);
            res.status(400).send(err);
        }
        res.render('customer/list', { title: "Customers", data: result.rows });
    });

};

exports.add = function(req, res) {
    res.render('customer/add', { title: "Add Customer" });
};

exports.edit = function(req, res) {

    var id = req.params.id;

    client.query('SELECT * FROM customer WHERE customer_id=$1', [id], function(err, result) {
        if (err) {
            console.log(err);
            res.status(400).send(err);
        }
        res.render('customer/edit', { title: "Edit Customer", data: result.rows });
    });

};

exports.save = function(req, res) {

    var cols = [req.body.first_name, req.body.last_name, req.body.address_id, req.body.email, 1];
    console.log(cols.toString())
    client.query('INSERT INTO customer(first_name, last_name, address_id, email, store_id) VALUES($1, $2, $3, $4, $5) RETURNING *', cols, function(err, result) {
        if (err) {
            console.log("Error Saving : %s ", err);
        }
        res.redirect('/customers');
    });

};

exports.update = function(req, res) {

    var cols = [req.body.first_name, req.body.address_id, req.body.email, req.body.last_name, req.params.id];
    console.log(cols.toString())

    client.query('UPDATE customer SET first_name=$1, address_id=$2,email=$3,last_name=$4 WHERE customer_id=$5', cols, function(err, result) {
        if (err) {
            console.log("Error Updating : %s ", err);
        }

        console.log(result)
        res.redirect('/customers');
    });

};

exports.delete = function(req, res) {

    var id = req.params.id;

    client.query("DELETE FROM customer WHERE customer_id=$1", [id], function(err, rows) {
        if (err) {
            console.log("Error deleting : %s ", err);
        }
        res.redirect('/customers');
    });

};