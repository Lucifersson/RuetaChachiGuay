CREATE TABLE IF NOT EXISTS user_roulette (
    id SERIAL NOT NULL,
    username TEXT NOT NULL,
    password TEXT NOT NULL,
    credit NUMERIC(10, 2) NOT NULL,

    CONSTRAINT user_roulette_pk PRIMARY KEY(id),
    CONSTRAINT user_roulette_username_uq UNIQUE(username)
);

CREATE TABLE IF NOT EXISTS auth_token (
    id SERIAL NOT NULL,
    user_id INTEGER NOT NULL,
    token TEXT NOT NULL,
    expiration_date TIMESTAMP NOT NULL,

    CONSTRAINT auth_token_pk PRIMARY KEY(id),
    CONSTRAINT auth_token_user_id_fk FOREIGN KEY(user_id) REFERENCES user_roulette(id) ON DELETE CASCADE,
    CONSTRAINT auth_token_token_uq UNIQUE(token)
);

CREATE TABLE IF NOT EXISTS spin (
    id SERIAL NOT NULL,
    user_id INTEGER NOT NULL,
    number SMALLINT NOT NULL,

    CONSTRAINT spin_pk PRIMARY KEY(id),
    CONSTRAINT spin_user_id_fk FOREIGN KEY(user_id) REFERENCES user_roulette(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS bet (
    id SERIAL NOT NULL,
    spin_id INTEGER NOT NULL,
    square SMALLINT NOT NULL,
    credit NUMERIC(10, 2) NOT NULL,

    CONSTRAINT bet_pk PRIMARY KEY(id),
    CONSTRAINT bet_spin_id_fk FOREIGN KEY(spin_id) REFERENCES spin(id) ON DELETE CASCADE
);
