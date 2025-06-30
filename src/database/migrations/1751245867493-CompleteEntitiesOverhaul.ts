import { MigrationInterface, QueryRunner } from 'typeorm';

export class CompleteEntitiesOverhaul1751245867493
  implements MigrationInterface
{
  name = 'CompleteEntitiesOverhaul1751245867493';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "stock" DROP CONSTRAINT "FK_e855a71c31948188c2bf78824a5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sale_item" DROP CONSTRAINT "FK_86634f729a5a169e50ab18b98a6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "stock" RENAME COLUMN "productId" TO "product_id"`,
    );
    await queryRunner.query(`ALTER TABLE "product" ADD "cost_price" integer`);
    await queryRunner.query(
      `ALTER TABLE "product" ADD "min_stock_level" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "sale_item" ADD "stock_id" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "sale" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "product" ADD CONSTRAINT "UQ_7ac18742b02b8af41afdaa3b9a9" UNIQUE ("barcode")`,
    );
    await queryRunner.query(
      `ALTER TABLE "product" ALTER COLUMN "base_price" SET DEFAULT '0'`,
    );
    await queryRunner.query(`ALTER TABLE "sale" DROP COLUMN "sale_date"`);
    await queryRunner.query(
      `ALTER TABLE "sale" ADD "sale_date" TIMESTAMP NOT NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_38160b93441b93c0b1e5221ede" ON "stock" ("product_id", "expiration_date") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_6bcdf6fb5cc91ceba253257665" ON "stock" ("expiration_date") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_375ba760c8cff338fc8c94b416" ON "stock" ("product_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_730b1714ac572fdcc90016ec44" ON "product" ("brand") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_d71ac3a30622a475df871b5513" ON "product" ("category") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_7ac18742b02b8af41afdaa3b9a" ON "product" ("barcode") `,
    );
    await queryRunner.query(
      `ALTER TABLE "stock" ADD CONSTRAINT "FK_375ba760c8cff338fc8c94b416c" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "sale_item" ADD CONSTRAINT "FK_86634f729a5a169e50ab18b98a6" FOREIGN KEY ("sale_id") REFERENCES "sale"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "sale_item" ADD CONSTRAINT "FK_9739f3f7791d96f45f3fd41f536" FOREIGN KEY ("stock_id") REFERENCES "stock"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "sale_item" DROP CONSTRAINT "FK_9739f3f7791d96f45f3fd41f536"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sale_item" DROP CONSTRAINT "FK_86634f729a5a169e50ab18b98a6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "stock" DROP CONSTRAINT "FK_375ba760c8cff338fc8c94b416c"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_7ac18742b02b8af41afdaa3b9a"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_d71ac3a30622a475df871b5513"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_730b1714ac572fdcc90016ec44"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_375ba760c8cff338fc8c94b416"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_6bcdf6fb5cc91ceba253257665"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_38160b93441b93c0b1e5221ede"`,
    );
    await queryRunner.query(`ALTER TABLE "sale" DROP COLUMN "sale_date"`);
    await queryRunner.query(`ALTER TABLE "sale" ADD "sale_date" date NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "product" ALTER COLUMN "base_price" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "product" DROP CONSTRAINT "UQ_7ac18742b02b8af41afdaa3b9a9"`,
    );
    await queryRunner.query(`ALTER TABLE "sale" DROP COLUMN "created_at"`);
    await queryRunner.query(`ALTER TABLE "sale_item" DROP COLUMN "stock_id"`);
    await queryRunner.query(
      `ALTER TABLE "product" DROP COLUMN "min_stock_level"`,
    );
    await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "cost_price"`);
    await queryRunner.query(
      `ALTER TABLE "stock" RENAME COLUMN "product_id" TO "productId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sale_item" ADD CONSTRAINT "FK_86634f729a5a169e50ab18b98a6" FOREIGN KEY ("sale_id") REFERENCES "sale"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "stock" ADD CONSTRAINT "FK_e855a71c31948188c2bf78824a5" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
