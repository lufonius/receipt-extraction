ALTER TABLE receipt RENAME COLUMN merchant to transactionMerchant;
ALTER TABLE receipt ADD COLUMN transactionTotal FLOAT NULL;
ALTER TABLE receipt ADD COLUMN transactionDate DATE NULL;
