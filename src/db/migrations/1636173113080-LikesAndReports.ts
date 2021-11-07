import {MigrationInterface, QueryRunner} from "typeorm";

export class LikesAndReports1636173113080 implements MigrationInterface {
    name = 'LikesAndReports1636173113080'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "temporary_users" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "email" varchar NOT NULL, "password" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "points" integer NOT NULL DEFAULT (0), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"))`);
        await queryRunner.query(`INSERT INTO "temporary_users"("id", "name", "email", "password", "createdAt", "points") SELECT "id", "name", "email", "password", "createdAt", "point" FROM "users"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`ALTER TABLE "temporary_users" RENAME TO "users"`);
        await queryRunner.query(`CREATE TABLE "temporary_postings" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "userId" integer NOT NULL, "text" varchar NOT NULL, "imgPath" varchar, "category" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "reports" integer NOT NULL DEFAULT (0))`);
        await queryRunner.query(`INSERT INTO "temporary_postings"("id", "userId", "text", "imgPath", "category", "createdAt") SELECT "id", "userId", "text", "imgPath", "category", "createdAt" FROM "postings"`);
        await queryRunner.query(`DROP TABLE "postings"`);
        await queryRunner.query(`ALTER TABLE "temporary_postings" RENAME TO "postings"`);
        await queryRunner.query(`CREATE TABLE "temporary_comment" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "userId" integer NOT NULL, "content" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "postingId" integer, "likes" integer NOT NULL DEFAULT (0), "reports" integer NOT NULL, CONSTRAINT "FK_a9e98277326c15149cadaeb6ed7" FOREIGN KEY ("postingId") REFERENCES "postings" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_comment"("id", "userId", "content", "createdAt", "postingId") SELECT "id", "userId", "content", "createdAt", "postingId" FROM "comment"`);
        await queryRunner.query(`DROP TABLE "comment"`);
        await queryRunner.query(`ALTER TABLE "temporary_comment" RENAME TO "comment"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comment" RENAME TO "temporary_comment"`);
        await queryRunner.query(`CREATE TABLE "comment" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "userId" integer NOT NULL, "content" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "postingId" integer, CONSTRAINT "FK_a9e98277326c15149cadaeb6ed7" FOREIGN KEY ("postingId") REFERENCES "postings" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "comment"("id", "userId", "content", "createdAt", "postingId") SELECT "id", "userId", "content", "createdAt", "postingId" FROM "temporary_comment"`);
        await queryRunner.query(`DROP TABLE "temporary_comment"`);
        await queryRunner.query(`ALTER TABLE "postings" RENAME TO "temporary_postings"`);
        await queryRunner.query(`CREATE TABLE "postings" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "userId" integer NOT NULL, "text" varchar NOT NULL, "imgPath" varchar, "category" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')))`);
        await queryRunner.query(`INSERT INTO "postings"("id", "userId", "text", "imgPath", "category", "createdAt") SELECT "id", "userId", "text", "imgPath", "category", "createdAt" FROM "temporary_postings"`);
        await queryRunner.query(`DROP TABLE "temporary_postings"`);
        await queryRunner.query(`ALTER TABLE "users" RENAME TO "temporary_users"`);
        await queryRunner.query(`CREATE TABLE "users" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "email" varchar NOT NULL, "password" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "point" integer NOT NULL DEFAULT (0), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"))`);
        await queryRunner.query(`INSERT INTO "users"("id", "name", "email", "password", "createdAt", "point") SELECT "id", "name", "email", "password", "createdAt", "points" FROM "temporary_users"`);
        await queryRunner.query(`DROP TABLE "temporary_users"`);
    }

}
