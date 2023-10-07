import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateUser1666118882625 implements MigrationInterface {
  private table = new Table({
    name: 'user',
    columns: [
      {
        name: 'id',
        isPrimary: true,
        type: 'serial',
      },
      {
        name: 'username',
        isUnique: true,
        type: 'varchar(64)',
        isNullable: false,
      },
      {
        name: 'password',
        type: 'varchar(256)',
        isNullable: false,
      },
      {
        name: 'first_name',
        type: 'varchar(64)',
        isNullable: false,
      },
      {
        name: 'last_name',
        type: 'varchar(64)',
        isNullable: false,
      },
      {
        name: 'date_of_birth',
        type: 'date',
        isNullable: false,
      },
      {
        name: 'role',
        type: 'varchar(16)',
        isNullable: false,
      },
      {
        name: 'created_at',
        type: 'timestamp',
        isNullable: false,
        default: 'CURRENT_TIMESTAMP',
      },
      {
        name: 'updated_at',
        type: 'timestamp',
        isNullable: false,
        default: 'CURRENT_TIMESTAMP',
      },
    ],
  });

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(this.table);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(this.table);
  }
}
