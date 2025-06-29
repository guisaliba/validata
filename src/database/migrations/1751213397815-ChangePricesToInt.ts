import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangePricesToInt1751213397815 implements MigrationInterface {
  name = 'ChangePricesToInt1751213397815';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Clear all data first
    await queryRunner.query(`TRUNCATE TABLE "sale_item" CASCADE`);
    await queryRunner.query(`TRUNCATE TABLE "sale" CASCADE`);
    await queryRunner.query(`TRUNCATE TABLE "product" CASCADE`);

    // Change column types (remove duplicates)
    await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "base_price"`);
    await queryRunner.query(
      `ALTER TABLE "product" ADD "base_price" integer NOT NULL`,
    );

    await queryRunner.query(`ALTER TABLE "sale_item" DROP COLUMN "unit_price"`);
    await queryRunner.query(
      `ALTER TABLE "sale_item" ADD "unit_price" integer NOT NULL`,
    );

    await queryRunner.query(`ALTER TABLE "sale" DROP COLUMN "total_value"`);
    await queryRunner.query(
      `ALTER TABLE "sale" ADD "total_value" integer NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "sale" DROP COLUMN "total_value"`);
    await queryRunner.query(
      `ALTER TABLE "sale" ADD "total_value" double precision NOT NULL`,
    );

    await queryRunner.query(`ALTER TABLE "sale_item" DROP COLUMN "unit_price"`);
    await queryRunner.query(
      `ALTER TABLE "sale_item" ADD "unit_price" double precision NOT NULL`,
    );

    await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "base_price"`);
    await queryRunner.query(
      `ALTER TABLE "product" ADD "base_price" double precision NOT NULL`,
    );
  }
}
