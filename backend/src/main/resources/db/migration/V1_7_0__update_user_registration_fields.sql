ALTER TABLE `user`
    ADD COLUMN email VARCHAR(250) NOT NULL,
    ADD COLUMN registration_confirmed BOOLEAN NOT NULL,
    ADD COLUMN registration_confirmation_code VARCHAR(250),
    ADD COLUMN registered_at DATE NOT NULL;
