const mysql = require('mysql2/promise');

describe('Minodu Database', () => {
  let connection

  beforeAll(async () => {
    connection = await mysql.createConnection({
      host: 'localhost',
      user: 'user',
      password: 'password',
      database: 'minodu',
      port: 3306
    });
  });

  afterAll(async () => {
    if (connection) {
      await connection.end();
    }
  });

  it('should connect to the database', async () => {
    expect(connection).toBeTruthy();
  });

  it('should be able to execute a simple query', async () => {
    const [rows] = await connection.execute('SELECT 1 + 1 AS solution');
    expect(rows).toBeTruthy();
    expect(rows[0]).toHaveProperty('solution', 2);
  });

  it('should have expected tables', async () => {
    const [tables] = await connection.execute(
      "SHOW TABLES FROM minodu"
    );

    // Add expected table names here
    const expectedTables = [
      // Example: 'users', 'posts', etc.
      // Replace with actual table names from your database schema
    ];

    const tableNames = tables.map((table) => Object.values(table)[0]);
    
    expectedTables.forEach(tableName => {
      expect(tableNames).toContain(tableName);
    });
  });
});

