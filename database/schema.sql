set client_min_messages to warning;

-- DANGER: this is NOT how to do it in the real world.
-- `drop schema` INSTANTLY ERASES EVERYTHING.
drop schema "public" cascade;

create schema "public";

CREATE TABLE "users" (
	"userId" serial NOT NULL,
	"name" TEXT NOT NULL,
	"userName" TEXT NOT NULL,
	"hashedPassword" TEXT NOT NULL,
	"joinedAt" timestamptz NOT NULL,
	CONSTRAINT "users_pk" PRIMARY KEY ("userId")
) WITH (
  OIDS=FALSE
);

CREATE TABLE "gyms" (
	"gymId" serial NOT NULL,
	"name" TEXT NOT NULL,
	"lat" float8 NOT NULL,
	"lng" float8 NOT NULL,
	"rating" int,
	CONSTRAINT "gyms_pk" PRIMARY KEY ("gymId")
) WITH (
  OIDS=FALSE
);

CREATE TABLE "ratings" (
	"userId" int NOT NULL,
	"gymId" int NOT NULL,
	"rating" int
) WITH (
  OIDS=FALSE
);

ALTER TABLE "ratings" ADD CONSTRAINT "ratings_fk0" FOREIGN KEY ("userId") REFERENCES "users"("userId");
ALTER TABLE "ratings" ADD CONSTRAINT "ratings_fk1" FOREIGN KEY ("gymId") REFERENCES "gyms"("gymId");
