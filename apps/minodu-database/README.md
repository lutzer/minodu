# Minodu Database

Runs mysql database instance on localhost:3306/minodu

## Commands

```
# Start the MySQL container
nx up minodu-database

# Stop the MySQL container
nx down minodu-database

# View logs
nx logs minodu-database

# Connect to MySQL shell
nx shell minodu-database

# Build the Docker image
nx build minodu-database

# Clear database by removing data folder
nx clear 
```