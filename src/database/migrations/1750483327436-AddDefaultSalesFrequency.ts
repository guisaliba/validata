import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddDefaultSalesFrequency1750483327436
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE "product" ALTER COLUMN "sales_frequency" SET DEFAULT 0',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE "product" ALTER COLUMN "sales_frequency" DROP DEFAULT',
    );
  }
}
