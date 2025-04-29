-- AlterTable
ALTER TABLE `users` MODIFY `role` ENUM('pasien', 'dokter', 'apoteker') NOT NULL;
