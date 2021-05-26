CREATE SCHEMA IF NOT EXISTS drezip;

CREATE USER IF NOT EXISTS 'drezip_app'@'%' IDENTIFIED BY 'drezip_app';
CREATE USER IF NOT EXISTS 'drezip_flyway'@'%' IDENTIFIED BY 'drezip_flyway';

CREATE ROLE IF NOT EXISTS ddl;
GRANT DROP, CREATE, ALTER, REFERENCES ON drezip.* TO ddl;

CREATE ROLE IF NOT EXISTS dml;
GRANT INSERT, UPDATE, DELETE ON drezip.* TO dml;

CREATE ROLE IF NOT EXISTS dql;
GRANT SELECT ON drezip.* TO dql;

GRANT ddl TO 'drezip_flyway'@'%';
GRANT dml TO 'drezip_flyway'@'%';
GRANT dql TO 'drezip_flyway'@'%';

GRANT dml TO 'drezip_app'@'%';
GRANT dql TO 'drezip_app'@'%';
-- roles need to be activated when the user logs in
-- with this statement, all assigned roles are activated by default
SET DEFAULT ROLE ALL TO 'drezip_flyway'@'%','drezip_app'@'%';