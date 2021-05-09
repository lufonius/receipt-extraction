CREATE USER 'drezip_app'@'%' IDENTIFIED BY 'drezip_app';
CREATE USER 'drezip_flyway'@'%' IDENTIFIED BY 'drezip_flyway';

CREATE ROLE ddl;
GRANT DROP, CREATE, ALTER ON test_drezip.* TO ddl;

CREATE ROLE dml;
GRANT INSERT, UPDATE, DELETE ON test_drezip.* TO dml;

CREATE ROLE dql;
GRANT SELECT ON test_drezip.* TO dql;

GRANT ddl TO 'drezip_flyway'@'%';
GRANT dml TO 'drezip_flyway'@'%';
GRANT dql TO 'drezip_flyway'@'%';

GRANT dml TO 'drezip_app'@'%';
GRANT dql TO 'drezip_app'@'%';