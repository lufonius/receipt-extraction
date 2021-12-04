ALTER TABLE category ADD COLUMN user_id INT UNSIGNED NOT NULL DEFAULT 1;
ALTER TABLE category ADD CONSTRAINT fkCategoryUserId FOREIGN KEY (user_id) REFERENCES user(id);

ALTER TABLE line ADD COLUMN user_id INT UNSIGNED NOT NULL DEFAULT 1;
ALTER TABLE line ADD CONSTRAINT fkLineUserId FOREIGN KEY (user_id) REFERENCES user(id);

ALTER TABLE receipt ADD COLUMN user_id INT UNSIGNED NOT NULL DEFAULT 1;
ALTER TABLE receipt ADD CONSTRAINT fkReceiptUserId FOREIGN KEY (user_id) REFERENCES user(id);

ALTER TABLE receipt_item ADD COLUMN user_id INT UNSIGNED NOT NULL DEFAULT 1;
ALTER TABLE receipt_item ADD CONSTRAINT fkReceiptItemUserId FOREIGN KEY (user_id) REFERENCES user(id);

ALTER TABLE transaction ADD COLUMN user_id INT UNSIGNED NOT NULL DEFAULT 1;
ALTER TABLE transaction ADD CONSTRAINT fkTransactionUserId FOREIGN KEY (user_id) REFERENCES user(id);

ALTER TABLE transaction_item ADD COLUMN user_id INT UNSIGNED NOT NULL DEFAULT 1;
ALTER TABLE transaction_item ADD CONSTRAINT fkTransactionItemUserId FOREIGN KEY (user_id) REFERENCES user(id);