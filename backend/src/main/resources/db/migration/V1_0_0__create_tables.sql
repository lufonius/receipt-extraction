CREATE TABLE IF NOT EXISTS `category` (
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `avatar_url` VARCHAR(250) NOT NULL,
    `color` VARCHAR(7) NOT NULL,
    `name` VARCHAR(250) NOT NULL,
    `parent_category_id` INT UNSIGNED,
    CONSTRAINT fkCategoryParentCategoryId FOREIGN KEY (parent_category_id) REFERENCES category(id)
);

CREATE TABLE IF NOT EXISTS `transaction` (
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `date` TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS `transaction_item` (
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `label` VARCHAR(250) COMMENT 'a label is only used when the transaction item is assigned to a receipt',
    `amount` FLOAT NOT NULL,
    `category_id` INT UNSIGNED NOT NULL,
    `transaction_id` INT UNSIGNED NOT NULL COMMENT 'a transaction consist of multiple transaction items',
    CONSTRAINT fkTransactionItemCategoryId FOREIGN KEY (category_id) REFERENCES category(id),
    CONSTRAINT fkTransactionItemTransactionId FOREIGN KEY (transaction_id) REFERENCES transaction(id)
);

CREATE TABLE IF NOT EXISTS `receipt` (
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `status` VARCHAR(25) NOT NULL,
    `img_url` VARCHAR(250) NOT NULL,
    `angle` FLOAT,
    `transaction_id` INT UNSIGNED COMMENT 'a transaction can be based on a receipt',
    CONSTRAINT fkReceiptTransactionId FOREIGN KEY (transaction_id) REFERENCES transaction(id)
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
    `receipt_id` INT UNSIGNED NOT NULL,
    CONSTRAINT fkLineReceiptId FOREIGN KEY (receipt_id) REFERENCES receipt(id)
);

CREATE TABLE IF NOT EXISTS `tax` (
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `percentage` FLOAT NOT NULL,
    `amount` FLOAT NOT NULL,
    `transaction_id` INT UNSIGNED NOT NULL COMMENT 'a transaction can be based on a receipt',
    CONSTRAINT fkTaxTransactionId FOREIGN KEY (transaction_id) REFERENCES transaction(id)
);
