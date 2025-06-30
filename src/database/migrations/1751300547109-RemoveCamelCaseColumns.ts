import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveCamelCaseColumns1751300547109 implements MigrationInterface {
  name = 'RemoveCamelCaseColumns1751300547109';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "stock" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "product_id" uuid NOT NULL, "quantity" integer NOT NULL, "expiration_date" date NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_092bc1fc7d860426a1dec5aa8e9" PRIMARY KEY ("id"))`,
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
      `CREATE TABLE "discount" ("product_id" uuid NOT NULL, "expiration_date" date NOT NULL, "sales_frequency" double precision NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_070fc062930e8f995a39bd70f8b" PRIMARY KEY ("product_id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "product" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "barcode" character varying NOT NULL, "name" character varying NOT NULL, "brand" character varying NOT NULL, "category" character varying NOT NULL, "cost_price" integer, "base_price" integer NOT NULL DEFAULT '0', "sales_frequency" double precision NOT NULL DEFAULT '0', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "min_stock_level" integer, CONSTRAINT "UQ_7ac18742b02b8af41afdaa3b9a9" UNIQUE ("barcode"), CONSTRAINT "PK_bebc9158e480b949565b4dc7a82" PRIMARY KEY ("id"))`,
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
      `CREATE TABLE "sale_item" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "sale_id" uuid NOT NULL, "product_id" uuid NOT NULL, "stock_id" uuid NOT NULL, "quantity" integer NOT NULL, "unit_price" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_439a57a4a0d130329d3d2e671b6" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "sale" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "sale_date" TIMESTAMP NOT NULL, "total_value" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_d03891c457cbcd22974732b5de2" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."user_type_enum" AS ENUM('admin', 'user')`,
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "type" "public"."user_type_enum" NOT NULL DEFAULT 'user', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "stock" ADD CONSTRAINT "FK_375ba760c8cff338fc8c94b416c" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "discount" ADD CONSTRAINT "FK_070fc062930e8f995a39bd70f8b" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "sale_item" ADD CONSTRAINT "FK_86634f729a5a169e50ab18b98a6" FOREIGN KEY ("sale_id") REFERENCES "sale"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "sale_item" ADD CONSTRAINT "FK_104266e6e0f51e5b33484efa280" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "sale_item" ADD CONSTRAINT "FK_9739f3f7791d96f45f3fd41f536" FOREIGN KEY ("stock_id") REFERENCES "stock"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
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
      `ALTER TABLE "sale_item" DROP CONSTRAINT "FK_9739f3f7791d96f45f3fd41f536"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sale_item" DROP CONSTRAINT "FK_104266e6e0f51e5b33484efa280"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sale_item" DROP CONSTRAINT "FK_86634f729a5a169e50ab18b98a6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "discount" DROP CONSTRAINT "FK_070fc062930e8f995a39bd70f8b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "stock" DROP CONSTRAINT "FK_375ba760c8cff338fc8c94b416c"`,
    );
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TYPE "public"."user_type_enum"`);
    await queryRunner.query(`DROP TABLE "sale"`);
    await queryRunner.query(`DROP TABLE "sale_item"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_7ac18742b02b8af41afdaa3b9a"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_d71ac3a30622a475df871b5513"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_730b1714ac572fdcc90016ec44"`,
    );
    await queryRunner.query(`DROP TABLE "product"`);
    await queryRunner.query(`DROP TABLE "discount"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_375ba760c8cff338fc8c94b416"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_6bcdf6fb5cc91ceba253257665"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_38160b93441b93c0b1e5221ede"`,
    );
    await queryRunner.query(`DROP TABLE "stock"`);
  }
}
