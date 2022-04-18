<?php

namespace App\DataFixtures;

use App\Entity\PriceClass;
use App\Entity\PriceClassAttribute;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\Persistence\ObjectManager;

class PriceClassesFixtures extends Fixture implements DependentFixtureInterface
{
    public const PRICECLASSES = array(
        "менее 3 млн",
        "от 3 до 5 млн",
        "от 5 до 7 млн",
        "от 7 до 9 млн",
        "от 9 до 11 млн",
        "более 11 млн"
    );

    public function load(ObjectManager $manager): void
    {
        for ($i = 0; $i < count(self::PRICECLASSES); $i++){
            $priceClass = new PriceClass();
            $priceClass->setName(self::PRICECLASSES[$i]);

            // foreach(AttributesFixtures::ATTRIBUTES as $attribute) { 
            //     $newPriceClassAttribute = new PriceClassAttribute();
            //     $newPriceClassAttribute->setAttribute($this->getReference($attribute['name']));
            //     $priceClass->addPriceClassAttribute($newPriceClassAttribute);
            //     $manager->persist($newPriceClassAttribute);
            // }
            $manager->persist($priceClass);
            $this->addReference(self::PRICECLASSES[$i], $priceClass);
        }

        $manager->flush();
    }

    public function getDependencies()
    {
        return [
            AttributesFixtures::class,
        ];
    }
}
