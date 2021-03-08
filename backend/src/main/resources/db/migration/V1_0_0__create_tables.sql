CREATE TABLE IF NOT EXISTS `category` (
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `avatar_url` VARCHAR(250) NOT NULL,
    `color` VARCHAR(7) NOT NULL,
    `name` VARCHAR(250) NOT NULL,
    `parent_category_id` INT UNSIGNED
);

CREATE TABLE IF NOT EXISTS `transaction` (
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `date` DATE NOT NULL
);

CREATE TABLE IF NOT EXISTS `receipt` (
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `status` VARCHAR(25) NOT NULL,
    `img_url` VARCHAR(250) NOT NULL,
    `angle` FLOAT,
    `transaction_id` INT UNSIGNED COMMENT 'a transaction can be based on a receipt',
    `uploaded_at` DATE NOT NULL
);

CREATE TABLE IF NOT EXISTS `transaction_item` (
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `amount` FLOAT NOT NULL,
    `category_id` INT UNSIGNED NOT NULL,
    `transaction_id` INT UNSIGNED NOT NULL COMMENT 'a transaction consist of multiple transaction items',
    `receipt_id` INT UNSIGNED
);

CREATE TABLE IF NOT EXISTS `receipt_item` (
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `receipt_id` INT UNSIGNED NOT NULL,
    `label` VARCHAR(2000),
    `label_line_id` INT UNSIGNED,
    `value` VARCHAR(50),
    `value_line_id` INT UNSIGNED,
    `type` VARCHAR(50) NOT NULL,
    `category_id` INT UNSIGNED COMMENT 'the reference to the category must be set if the itemType is equal to category'
);

CREATE TABLE IF NOT EXISTS `line` (
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `text` VARCHAR(2000) NOT NULL,
    `top_left_x` INT NOT NULL,
    `top_left_y` INT NOT NULL,
    `top_right_x` INT NOT NULL,
    `top_right_y` INT NOT NULL,
    `bottom_left_x` INT NOT NULL,
    `bottom_left_y` INT NOT NULL,
    `bottom_right_x` INT NOT NULL,
    `bottom_right_y` INT NOT NULL,
    `receipt_id` INT UNSIGNED NOT NULL
);

ALTER TABLE `category` ADD CONSTRAINT fkCategoryParentCategoryId FOREIGN KEY (parent_category_id) REFERENCES category(id);

ALTER TABLE `receipt` ADD CONSTRAINT fkReceiptTransactionId FOREIGN KEY (transaction_id) REFERENCES transaction(id);

ALTER TABLE `transaction_item` ADD CONSTRAINT fkTransactionItemCategoryId FOREIGN KEY (category_id) REFERENCES category(id);
ALTER TABLE `transaction_item` ADD CONSTRAINT fkTransactionItemTransactionId FOREIGN KEY (transaction_id) REFERENCES transaction(id);
ALTER TABLE `transaction_item` ADD CONSTRAINT fkTransactionItemReceiptId FOREIGN KEY (receipt_id) REFERENCES receipt(id);

ALTER TABLE `receipt_item` ADD CONSTRAINT fkReceiptItemItemLabelLineId FOREIGN KEY (label_line_id) REFERENCES line(id);
ALTER TABLE `receipt_item` ADD CONSTRAINT fkReceiptItemItemValueLineId FOREIGN KEY (value_line_id) REFERENCES line(id);
ALTER TABLE `receipt_item` ADD CONSTRAINT fkReceiptItemCategoryId FOREIGN KEY (category_id) REFERENCES category(id);
ALTER TABLE `receipt_item` ADD CONSTRAINT fkReceiptItemReceiptId FOREIGN KEY (receipt_id) REFERENCES receipt(id);

ALTER TABLE `line` ADD CONSTRAINT fkLineReceiptId FOREIGN KEY (receipt_id) REFERENCES receipt(id);
