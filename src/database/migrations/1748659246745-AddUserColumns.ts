import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserColuns1748659246745 implements MigrationInterface {
  name = 'AddUserColuns1748659246745';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TYPE "user_type_enum" AS ENUM('admin', 'user')
        `);

    await queryRunner.query(`
            ALTER TABLE "user"
            ADD "email" character varying UNIQUE,
            ADD "password" character varying
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "user"
            DROP COLUMN "email",
            DROP COLUMN "password",
            DROP COLUMN "type"
        `);

    await queryRunner.query(`
            DROP TYPE "user_type_enum"
        `);
  }
}
