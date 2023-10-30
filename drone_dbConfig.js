var mysql = require('mysql');

var conn = mysql.createConnection({
	host: 'localhost', 
	user: 'root',      
	password: '',      
	database: 'drone_guy_db'
}); 

conn.connect(function(err) {
	if (err) {
        console.error('Error connecting to the database:', err);
    } else {
        console.log('Database is connected successfully!');
    }
});

module.exports = conn;