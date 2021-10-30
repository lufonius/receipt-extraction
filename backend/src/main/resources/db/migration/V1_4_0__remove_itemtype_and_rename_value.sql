ALTER TABLE receipt_item DROP COLUMN `type`;
ALTER TABLE receipt_item RENAME COLUMN `value` to price;
ALTER TABLE receipt_item MODIFY price FLOAT NULL;