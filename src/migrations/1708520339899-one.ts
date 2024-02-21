import {MigrationInterface, QueryRunner} from "typeorm";

export class one1708520339899 implements MigrationInterface {

   public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("CREATE TABLE `invoice_config` (`createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `channelId` varchar(255) NOT NULL, `enabled` tinyint NOT NULL DEFAULT 0, `templateString` text NULL, `id` int NOT NULL AUTO_INCREMENT, PRIMARY KEY (`id`)) ENGINE=InnoDB", undefined);
   }

   public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("DROP TABLE `invoice_config`", undefined);
   }

}
