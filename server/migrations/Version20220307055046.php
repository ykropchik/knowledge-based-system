<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20220307055046 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE price_class_price_class_attribute (price_class_id INT NOT NULL, price_class_attribute_id INT NOT NULL, INDEX IDX_4252D80888B63007 (price_class_id), INDEX IDX_4252D8081CC293DE (price_class_attribute_id), PRIMARY KEY(price_class_id, price_class_attribute_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE price_class_attribute_attribute (price_class_attribute_id INT NOT NULL, attribute_id INT NOT NULL, INDEX IDX_CC6AF2FC1CC293DE (price_class_attribute_id), INDEX IDX_CC6AF2FCB6E62EFA (attribute_id), PRIMARY KEY(price_class_attribute_id, attribute_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE price_class_price_class_attribute ADD CONSTRAINT FK_4252D80888B63007 FOREIGN KEY (price_class_id) REFERENCES price_class (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE price_class_price_class_attribute ADD CONSTRAINT FK_4252D8081CC293DE FOREIGN KEY (price_class_attribute_id) REFERENCES price_class_attribute (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE price_class_attribute_attribute ADD CONSTRAINT FK_CC6AF2FC1CC293DE FOREIGN KEY (price_class_attribute_id) REFERENCES price_class_attribute (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE price_class_attribute_attribute ADD CONSTRAINT FK_CC6AF2FCB6E62EFA FOREIGN KEY (attribute_id) REFERENCES attribute (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE price_class_attribute DROP FOREIGN KEY FK_53C9E7D6B6E62EFA');
        $this->addSql('DROP INDEX IDX_53C9E7D6B6E62EFA ON price_class_attribute');
        $this->addSql('ALTER TABLE price_class_attribute DROP attribute_id');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('DROP TABLE price_class_price_class_attribute');
        $this->addSql('DROP TABLE price_class_attribute_attribute');
        $this->addSql('ALTER TABLE attribute CHANGE name name VARCHAR(255) NOT NULL COLLATE `utf8mb4_unicode_ci`, CHANGE type type VARCHAR(255) DEFAULT NULL COLLATE `utf8mb4_unicode_ci`');
        $this->addSql('ALTER TABLE price_class CHANGE name name VARCHAR(255) NOT NULL COLLATE `utf8mb4_unicode_ci`');
        $this->addSql('ALTER TABLE price_class_attribute ADD attribute_id INT NOT NULL');
        $this->addSql('ALTER TABLE price_class_attribute ADD CONSTRAINT FK_53C9E7D6B6E62EFA FOREIGN KEY (attribute_id) REFERENCES attribute (id) ON UPDATE NO ACTION ON DELETE NO ACTION');
        $this->addSql('CREATE INDEX IDX_53C9E7D6B6E62EFA ON price_class_attribute (attribute_id)');
    }
}
