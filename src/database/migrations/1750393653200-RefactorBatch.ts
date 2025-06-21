import { MigrationInterface, QueryRunner } from 'typeorm';

export class RefactorBatch1750393653200 implements MigrationInterface {
  name = 'RefactorBatch1750393653200';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "stock" DROP CONSTRAINT "FK_375ba760c8cff338fc8c94b416c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "discount" DROP CONSTRAINT "FK_070fc062930e8f995a39bd70f8b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sales_analysis_product" DROP CONSTRAINT "FK_9c5c63a5aca1ea0c64966a0c890"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sales_analysis_product" DROP CONSTRAINT "FK_0bf52e3b3ccd33ede93909f6947"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sale_item" DROP CONSTRAINT "FK_86634f729a5a169e50ab18b98a6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sale_item" DROP CONSTRAINT "FK_104266e6e0f51e5b33484efa280"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sale" DROP CONSTRAINT "FK_a3f82cec1dac6638fba3e732530"`,
    );
    await queryRunner.query(`ALTER TABLE "stock" DROP COLUMN "product_id"`);
    await queryRunner.query(`ALTER TABLE "stock" DROP COLUMN "entry_date"`);
    await queryRunner.query(`ALTER TABLE "sale" DROP COLUMN "created_at"`);
    await queryRunner.query(
      `ALTER TABLE "stock" ADD "expiration_date" date NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "stock" ADD "productId" uuid`);
    await queryRunner.query(
      `ALTER TABLE "stock" ALTER COLUMN "created_at" SET DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "stock" ALTER COLUMN "updated_at" SET DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "discount" ALTER COLUMN "created_at" SET DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "discount" ALTER COLUMN "updated_at" SET DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "sales_analysis" ALTER COLUMN "created_at" SET DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "sales_analysis" ALTER COLUMN "updated_at" SET DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "sales_analysis_product" ALTER COLUMN "created_at" SET DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "sales_analysis_product" ALTER COLUMN "updated_at" SET DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "product" ALTER COLUMN "sales_frequency" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "product" ALTER COLUMN "created_at" SET DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "product" ALTER COLUMN "updated_at" SET DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "sale_item" ALTER COLUMN "created_at" SET DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "sale_item" ALTER COLUMN "updated_at" SET DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "sale" ALTER COLUMN "updated_at" SET DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "email" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "password" SET NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "type"`);
    await queryRunner.query(
      `ALTER TABLE "user" ADD "type" "public"."user_type_enum" NOT NULL DEFAULT 'user'`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "created_at" SET DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "updated_at" SET DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "stock" ADD CONSTRAINT "FK_e855a71c31948188c2bf78824a5" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "discount" ADD CONSTRAINT "FK_070fc062930e8f995a39bd70f8b" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "sales_analysis_product" ADD CONSTRAINT "FK_9c5c63a5aca1ea0c64966a0c890" FOREIGN KEY ("analysis_id") REFERENCES "sales_analysis"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "sales_analysis_product" ADD CONSTRAINT "FK_0bf52e3b3ccd33ede93909f6947" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "sale_item" ADD CONSTRAINT "FK_86634f729a5a169e50ab18b98a6" FOREIGN KEY ("sale_id") REFERENCES "sale"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "sale_item" ADD CONSTRAINT "FK_104266e6e0f51e5b33484efa280" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "sale" ADD CONSTRAINT "FK_a3f82cec1dac6638fba3e732530" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "sale" DROP CONSTRAINT "FK_a3f82cec1dac6638fba3e732530"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sale_item" DROP CONSTRAINT "FK_104266e6e0f51e5b33484efa280"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sale_item" DROP CONSTRAINT "FK_86634f729a5a169e50ab18b98a6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sales_analysis_product" DROP CONSTRAINT "FK_0bf52e3b3ccd33ede93909f6947"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sales_analysis_product" DROP CONSTRAINT "FK_9c5c63a5aca1ea0c64966a0c890"`,
    );
    await queryRunner.query(
      `ALTER TABLE "discount" DROP CONSTRAINT "FK_070fc062930e8f995a39bd70f8b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "stock" DROP CONSTRAINT "FK_e855a71c31948188c2bf78824a5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "type"`);
    await queryRunner.query(
      `ALTER TABLE "user" ADD "type" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "password" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "email" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "sale" ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "sale_item" ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "sale_item" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "product" ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "product" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "product" ALTER COLUMN "sales_frequency" SET DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "sales_analysis_product" ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "sales_analysis_product" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "sales_analysis" ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "sales_analysis" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "discount" ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "discount" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "stock" ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "stock" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP`,
    );
    await queryRunner.query(`ALTER TABLE "stock" DROP COLUMN "productId"`);
    await queryRunner.query(
      `ALTER TABLE "stock" DROP COLUMN "expiration_date"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sale" ADD "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "stock" ADD "entry_date" date NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "stock" ADD "product_id" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "sale" ADD CONSTRAINT "FK_a3f82cec1dac6638fba3e732530" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "sale_item" ADD CONSTRAINT "FK_104266e6e0f51e5b33484efa280" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "sale_item" ADD CONSTRAINT "FK_86634f729a5a169e50ab18b98a6" FOREIGN KEY ("sale_id") REFERENCES "sale"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "sales_analysis_product" ADD CONSTRAINT "FK_0bf52e3b3ccd33ede93909f6947" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "sales_analysis_product" ADD CONSTRAINT "FK_9c5c63a5aca1ea0c64966a0c890" FOREIGN KEY ("analysis_id") REFERENCES "sales_analysis"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "discount" ADD CONSTRAINT "FK_070fc062930e8f995a39bd70f8b" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "stock" ADD CONSTRAINT "FK_375ba760c8cff338fc8c94b416c" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }
}
