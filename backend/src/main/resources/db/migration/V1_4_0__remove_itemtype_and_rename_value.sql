ALTER TABLE receipt DELETE COLUMN type;
ALTER TABLE receipt RENAME COLUMN `value` to price;