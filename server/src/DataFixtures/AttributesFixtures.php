<?php

namespace App\DataFixtures;

use App\Entity\Attribute;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class AttributesFixtures extends Fixture
{
    public const ATTRIBUTES = array(
        "район расположения",
        "тип дома",
        "тип объекта",
        "год постройки",
        "количество этажей в доме",
        "этаж",
        "тип планировки",
        "число комнат",
        "площадь",
        "количество балконов/лоджий",
        "состояние ремонта в квартире",
        "наличие мебели и бытовой техники",
        "наличие благоустроенной придомовой территории",
        "количество детских садов в радиусе 1км",
        "количество школ в радиусе 1к"
    );

    public function load(ObjectManager $manager): void
    {
        for ($i = 0; $i < count(self::ATTRIBUTES); $i++){
            $attribute = new Attribute();
            $attribute->setName(self::ATTRIBUTES[$i]);
            $manager->persist($attribute);
        }

        $manager->flush();
    }
}
