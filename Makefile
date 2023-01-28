ifneq (,$(wildcard ./.env))
	include .env
	export
endif

postgres:
	docker run --name postgresDevExpert -p 5433:5432 -e POSTGRES_USER="${POSTGRES_USER_ROOT}" -e POSTGRES_PASSWORD="${POSTGRES_PASSWORD_ROOT}" -d postgres:15-alpine

dockerstart:
	docker start postgresDevExpert

dockerstop:
	docker stop postgresDevExpert

createdbprod:
	docker exec -it postgresDevExpert createdb --username="${POSTGRES_USER_ROOT}" --owner="${POSTGRES_USER_ROOT}" ${PGDATABASE}

createdbdev:
	docker exec -it postgresDevExpert createdb --username="${POSTGRES_USER_ROOT}" --owner="${POSTGRES_USER_ROOT}" ${PGDATABASE_TEST}

psqlroot:
	docker exec -it postgresDevExpert psql -U ${POSTGRES_USER_ROOT}

psqldbprod:
	docker exec -it postgresDevExpert psql -U ${PGUSER} -d ${PGDATABASE}

psqldbdev:
	docker exec -it postgresDevExpert psql -U ${PGUSER_TEST} -d ${PGDATABASE_TEST}

.PHONY: postgres dockerstart dockerstop createdbprod createdbdev psqlroot psqldbprod psqldbdev