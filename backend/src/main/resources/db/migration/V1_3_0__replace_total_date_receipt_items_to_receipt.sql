ALTER TABLE receipt RENAME COLUMN merchant to transaction_merchant;
ALTER TABLE receipt ADD COLUMN transaction_total FLOAT NULL;
ALTER TABLE receipt ADD COLUMN transaction_date DATE NULL;
