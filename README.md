
# E-Scapism

Intentionally minimal forum software.   
*This project is still in early development*

## Installation

#### Node JS
Install NodeJS (I suggest using [Volta](https://volta.sh/))  

#### MySQL
```bash
sudo apt install mysql-server
sudo systemctl start mysql.service
```

#### Clone repository

```bash
  git clone git@github.com:That-Thing/e-scapism.git
  cd e-scapism
```
Modify the config  
*make sure to change the salt (line 5)*

```bash
nano config/config.json
```

#### Initialize SQL Database
Enter the MySQL console
```bash
mysql -u username -p
```
In the MySQL console, execute the escapism sql file.
```bash
mysql> source /path/to/escapism/escapism.sql
```
Once the database has been created, press `CTRL+D` to exit.

#### Running
```bash
node app.js
```
