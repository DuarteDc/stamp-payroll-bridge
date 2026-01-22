import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAttempsToWorkflowLogs1769019655936
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "WORKFLOW_LOGS" ADD "ATTEMPTS" NUMBER DEFAULT 1`,
    );
    await queryRunner.query(`
            ALTER TABLE "WORKFLOW_LOGS" ADD "LAST_UPDATE" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "WORKFLOW_LOGS" DROP COLUMN "ATTEMPTS"`,
    );

    await queryRunner.query(
      `ALTER TABLE "WORKFLOW_LOGS" DROP COLUMN "LAST_UPDATE"`,
    );
  }
}
