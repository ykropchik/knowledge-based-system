<?php

namespace App\DataFixtures;

use App\Entity\PriceClass;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class PriceClassesFixtures extends Fixture
{
    public const PRICECLASSES = array(
        "менее 3 млн",
        "от 3 млн до 5 млн",
        "от 5 млн до 7 млн",
        "от 7 млн до 9 млн",
        "от 9 млн до 11 млн",
        "11 млн и более"
    );

    public function load(ObjectManager $manager): void
    {
        for ($i = 0; $i < count(self::PRICECLASSES); $i++){
            $priceClass = new PriceClass();
            $priceClass->setName(self::PRICECLASSES[$i]);
            $manager->persist($priceClass);
        }

        $manager->flush();
    }
}
