<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20220301042106 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE attribute (id INT AUTO_INCREMENT NOT NULL, name VARCHAR(255) NOT NULL, type VARCHAR(255) DEFAULT NULL, possible_values JSON DEFAULT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE price_class (id INT AUTO_INCREMENT NOT NULL, name VARCHAR(255) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE price_class_attribute (price_class_id INT NOT NULL, attribute_id INT NOT NULL, INDEX IDX_53C9E7D688B63007 (price_class_id), INDEX IDX_53C9E7D6B6E62EFA (attribute_id), PRIMARY KEY(price_class_id, attribute_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE price_class_attribute ADD CONSTRAINT FK_53C9E7D688B63007 FOREIGN KEY (price_class_id) REFERENCES price_class (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE price_class_attribute ADD CONSTRAINT FK_53C9E7D6B6E62EFA FOREIGN KEY (attribute_id) REFERENCES attribute (id) ON DELETE CASCADE');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE price_class_attribute DROP FOREIGN KEY FK_53C9E7D6B6E62EFA');
        $this->addSql('ALTER TABLE price_class_attribute DROP FOREIGN KEY FK_53C9E7D688B63007');
        $this->addSql('DROP TABLE attribute');
        $this->addSql('DROP TABLE price_class');
        $this->addSql('DROP TABLE price_class_attribute');
    }
}
