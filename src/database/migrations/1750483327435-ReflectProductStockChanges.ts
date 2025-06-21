import { MigrationInterface, QueryRunner } from 'typeorm';

export class ReflectProductStockChanges1750483327435
  implements MigrationInterface
{
  name = 'ReflectProductStockChanges1750483327435';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "product" ADD "barcode" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "product" ADD "brand" character varying NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "brand"`);
    await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "barcode"`);
  }
}
