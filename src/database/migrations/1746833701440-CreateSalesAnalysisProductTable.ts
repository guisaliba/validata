import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateSalesAnalysisProductTable1746833701440
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'sales_analysis_product',
        columns: [
          {
            name: 'analysis_id',
            type: 'uuid',
            isPrimary: true,
          },
          {
            name: 'product_id',
            type: 'uuid',
            isPrimary: true,
          },
          {
            name: 'quantity',
            type: 'int',
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'sales_analysis_product',
      new TableForeignKey({
        columnNames: ['analysis_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'sales_analysis',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'sales_analysis_product',
      new TableForeignKey({
        columnNames: ['product_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'product',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('sales_analysis_product');
    if (table) {
      const analysisForeignKey = table.foreignKeys.find(
        (fk) => fk.columnNames.indexOf('analysis_id') !== -1,
      );
      if (analysisForeignKey) {
        await queryRunner.dropForeignKey(
          'sales_analysis_product',
          analysisForeignKey,
        );
      }

      const productForeignKey = table.foreignKeys.find(
        (fk) => fk.columnNames.indexOf('product_id') !== -1,
      );
      if (productForeignKey) {
        await queryRunner.dropForeignKey(
          'sales_analysis_product',
          productForeignKey,
        );
      }
    }
    await queryRunner.dropTable('sales_analysis_product');
  }
}
