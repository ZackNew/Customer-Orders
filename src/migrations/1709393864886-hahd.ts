import {MigrationInterface, QueryRunner} from "typeorm";

export class hahd1709393864886 implements MigrationInterface {

   public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `administrator` ADD `customFieldsPhonenumber` varchar(255) NULL", undefined);
   }

   public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `administrator` DROP COLUMN `customFieldsPhonenumber`", undefined);
   }

}
