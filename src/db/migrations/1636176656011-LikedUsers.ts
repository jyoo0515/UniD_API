import {MigrationInterface, QueryRunner} from "typeorm";

export class LikedUsers1636176656011 implements MigrationInterface {
    name = 'LikedUsers1636176656011'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "temporary_comment" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "userId" integer NOT NULL, "content" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "postingId" integer, "likes" integer NOT NULL DEFAULT (0), "reports" integer NOT NULL, "likedUsers" text array, CONSTRAINT "FK_a9e98277326c15149cadaeb6ed7" FOREIGN KEY ("postingId") REFERENCES "postings" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_comment"("id", "userId", "content", "createdAt", "postingId", "likes", "reports") SELECT "id", "userId", "content", "createdAt", "postingId", "likes", "reports" FROM "comment"`);
        await queryRunner.query(`DROP TABLE "comment"`);
        await queryRunner.query(`ALTER TABLE "temporary_comment" RENAME TO "comment"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comment" RENAME TO "temporary_comment"`);
        await queryRunner.query(`CREATE TABLE "comment" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "userId" integer NOT NULL, "content" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "postingId" integer, "likes" integer NOT NULL DEFAULT (0), "reports" integer NOT NULL, CONSTRAINT "FK_a9e98277326c15149cadaeb6ed7" FOREIGN KEY ("postingId") REFERENCES "postings" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "comment"("id", "userId", "content", "createdAt", "postingId", "likes", "reports") SELECT "id", "userId", "content", "createdAt", "postingId", "likes", "reports" FROM "temporary_comment"`);
        await queryRunner.query(`DROP TABLE "temporary_comment"`);
    }

}
