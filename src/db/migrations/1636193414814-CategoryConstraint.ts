import {MigrationInterface, QueryRunner} from "typeorm";

export class CategoryConstraint1636193414814 implements MigrationInterface {
    name = 'CategoryConstraint1636193414814'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "temporary_comment" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "userId" integer NOT NULL, "content" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "postingId" integer, "likes" integer NOT NULL DEFAULT (0), "reports" integer NOT NULL DEFAULT (0), "likedUsers" text array, CONSTRAINT "FK_a9e98277326c15149cadaeb6ed7" FOREIGN KEY ("postingId") REFERENCES "postings" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_comment"("id", "userId", "content", "createdAt", "postingId", "likes", "reports", "likedUsers") SELECT "id", "userId", "content", "createdAt", "postingId", "likes", "reports", "likedUsers" FROM "comment"`);
        await queryRunner.query(`DROP TABLE "comment"`);
        await queryRunner.query(`ALTER TABLE "temporary_comment" RENAME TO "comment"`);
        await queryRunner.query(`CREATE TABLE "temporary_comment" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "userId" integer NOT NULL, "content" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "postingId" integer, "likes" integer NOT NULL DEFAULT (0), "reports" integer NOT NULL DEFAULT (0), "likedUsers" text array, CONSTRAINT "FK_a9e98277326c15149cadaeb6ed7" FOREIGN KEY ("postingId") REFERENCES "postings" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_comment"("id", "userId", "content", "createdAt", "postingId", "likes", "reports", "likedUsers") SELECT "id", "userId", "content", "createdAt", "postingId", "likes", "reports", "likedUsers" FROM "comment"`);
        await queryRunner.query(`DROP TABLE "comment"`);
        await queryRunner.query(`ALTER TABLE "temporary_comment" RENAME TO "comment"`);
        await queryRunner.query(`CREATE TABLE "temporary_postings" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "userId" integer NOT NULL, "text" varchar NOT NULL, "imgPath" varchar, "category" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "reports" integer NOT NULL DEFAULT (0), CONSTRAINT "CHK_43ad83d6f86d6f0aa0d4dec60d" CHECK ("category" = 'engineering' OR "category" = 'natural science' OR "category" = 'medicine' OR "category" = 'humanities' OR "category" = 'economics' OR "category" = 'art' OR "category" = 'sports' OR "category" = 'social science' OR "category" = 'agriculture' OR "category" = 'law'))`);
        await queryRunner.query(`INSERT INTO "temporary_postings"("id", "userId", "text", "imgPath", "category", "createdAt", "reports") SELECT "id", "userId", "text", "imgPath", "category", "createdAt", "reports" FROM "postings"`);
        await queryRunner.query(`DROP TABLE "postings"`);
        await queryRunner.query(`ALTER TABLE "temporary_postings" RENAME TO "postings"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "postings" RENAME TO "temporary_postings"`);
        await queryRunner.query(`CREATE TABLE "postings" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "userId" integer NOT NULL, "text" varchar NOT NULL, "imgPath" varchar, "category" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "reports" integer NOT NULL DEFAULT (0))`);
        await queryRunner.query(`INSERT INTO "postings"("id", "userId", "text", "imgPath", "category", "createdAt", "reports") SELECT "id", "userId", "text", "imgPath", "category", "createdAt", "reports" FROM "temporary_postings"`);
        await queryRunner.query(`DROP TABLE "temporary_postings"`);
        await queryRunner.query(`ALTER TABLE "comment" RENAME TO "temporary_comment"`);
        await queryRunner.query(`CREATE TABLE "comment" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "userId" integer NOT NULL, "content" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "postingId" integer, "likes" integer NOT NULL DEFAULT (0), "reports" integer NOT NULL DEFAULT (0), "likedUsers" text array, CONSTRAINT "FK_a9e98277326c15149cadaeb6ed7" FOREIGN KEY ("postingId") REFERENCES "postings" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "comment"("id", "userId", "content", "createdAt", "postingId", "likes", "reports", "likedUsers") SELECT "id", "userId", "content", "createdAt", "postingId", "likes", "reports", "likedUsers" FROM "temporary_comment"`);
        await queryRunner.query(`DROP TABLE "temporary_comment"`);
        await queryRunner.query(`ALTER TABLE "comment" RENAME TO "temporary_comment"`);
        await queryRunner.query(`CREATE TABLE "comment" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "userId" integer NOT NULL, "content" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "postingId" integer, "likes" integer NOT NULL DEFAULT (0), "reports" integer NOT NULL DEFAULT (0), "likedUsers" text array, CONSTRAINT "FK_a9e98277326c15149cadaeb6ed7" FOREIGN KEY ("postingId") REFERENCES "postings" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "comment"("id", "userId", "content", "createdAt", "postingId", "likes", "reports", "likedUsers") SELECT "id", "userId", "content", "createdAt", "postingId", "likes", "reports", "likedUsers" FROM "temporary_comment"`);
        await queryRunner.query(`DROP TABLE "temporary_comment"`);
    }

}
