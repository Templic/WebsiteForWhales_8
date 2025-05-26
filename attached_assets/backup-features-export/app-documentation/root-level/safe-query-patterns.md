# Safe Database Query Patter

n

s

## Instead o

f:

```typescript

const query = `SELECT * FROM users WHERE id = ${userId}`;
```

## Instead of: __CODE_BLOCK_

0__

## Us

e:

```typescript

const query = 'SELECT * FROM users WHERE id = $1';

const result = await db.query(query, [userId]);
```