<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20220405083421 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE price_class_attribute DROP FOREIGN KEY FK_53C9E7D6B6E62EFA');
        $this->addSql('ALTER TABLE price_class_attribute ADD CONSTRAINT FK_53C9E7D6B6E62EFA FOREIGN KEY (attribute_id) REFERENCES attribute (id) ON DELETE CASCADE');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE attribute CHANGE name name VARCHAR(255) NOT NULL COLLATE `utf8mb4_unicode_ci`, CHANGE type type VARCHAR(255) DEFAULT NULL COLLATE `utf8mb4_unicode_ci`');
        $this->addSql('ALTER TABLE price_class CHANGE name name VARCHAR(255) NOT NULL COLLATE `utf8mb4_unicode_ci`');
        $this->addSql('ALTER TABLE price_class_attribute DROP FOREIGN KEY FK_53C9E7D6B6E62EFA');
        $this->addSql('ALTER TABLE price_class_attribute ADD CONSTRAINT FK_53C9E7D6B6E62EFA FOREIGN KEY (attribute_id) REFERENCES attribute (id) ON UPDATE NO ACTION ON DELETE NO ACTION');
    }
}
