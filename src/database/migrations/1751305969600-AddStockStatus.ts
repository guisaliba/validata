import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddStockStatus1751301000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create enum type
    await queryRunner.query(`
      CREATE TYPE "stock_status_enum" AS ENUM(
        'ACTIVE', 
        'DEPLETED', 
        'EXPIRED', 
        'DISCONTINUED'
      )
    `);

    // Add status column
    await queryRunner.query(`
      ALTER TABLE "stock" 
      ADD COLUMN "status" "stock_status_enum" 
      NOT NULL DEFAULT 'ACTIVE'
    `);

    // Update existing depleted stock
    await queryRunner.query(`
      UPDATE "stock" 
      SET "status" = 'DEPLETED' 
      WHERE "quantity" <= 0
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "stock" DROP COLUMN "status"`);
    await queryRunner.query(`DROP TYPE "stock_status_enum"`);
  }
}
