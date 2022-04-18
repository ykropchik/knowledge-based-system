<?php

namespace App\DataFixtures;

use App\Entity\PriceClass;
use App\Entity\PriceClassAttribute;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\Persistence\ObjectManager;

class PriceClassesAttributesFixtures extends Fixture implements DependentFixtureInterface
{
    public const PRICECLASSES_ATTRIBUTES = [
        [
        "attributeName" => "район расположения",
        "менее 3 млн" => [
            "Вторая речка",
            "Эгершельд",
            "Первая речка",
            "Чуркин",
            "Тихая",
        ],
        "от 3 до 5 млн" => [
            "Вторая речка",
            "Эгершельд",
            "Центр",
            "Первая речка",
            "Чуркин",
            "Тихая",
        ],
        "от 5 до 7 млн" => [
            "Вторая речка",
            "Эгершельд",
            "Центр",
            "Первая речка",
            "Чуркин",
            "Тихая",
        ],
        "от 7 до 9 млн" => [
            "Вторая речка",
            "Эгершельд",
            "Центр",
            "Первая речка",
            "Чуркин",
        ],
        "от 9 до 11 млн" => [
            "Вторая речка",
            "Эгершельд",
            "Центр",
            "Первая речка",
            "Чуркин",
        ],
        "более 11 млн" => [
            "Вторая речка",
            "Эгершельд",
            "Центр",
            "Первая речка",
            "Чуркин",
        ],
    ],
    [
        "attributeName" => "тип дома",
        "менее 3 млн" => ["Кирпичный", "Панельный"],
        "от 3 до 5 млн" => ["Кирпичный", "Панельный"],
        "от 5 до 7 млн" => ["Кирпичный", "Блочный", "Панельный"],
        "от 7 до 9 млн" => ["Монолитный", "Кирпичный", "Блочный", "Панельный"],
        "от 9 до 11 млн" => ["Монолитный", "Кирпичный", "Блочный", "Панельный"],
        "более 11 млн" => ["Панельный", "Монолитный", "Кирпичный", "Блочный"],
    ],
    [
        "attributeName" => "тип объекта",
        "менее 3 млн" => ["Вторичка"],
        "от 3 до 5 млн" => ["Новостройка", "Вторичка"],
        "от 5 до 7 млн" => ["Новостройка", "Вторичка"],
        "от 7 до 9 млн" => ["Новостройка", "Вторичка"],
        "от 9 до 11 млн" => ["Новостройка", "Вторичка"],
        "более 11 млн" => ["Новостройка", "Вторичка"],
    ],
    [
        "attributeName" => "год постройки",
        "менее 3 млн" => ["units" => "Год", "min" => 1957, "max" => 1976],
        "от 3 до 5 млн" => ["units" => "Год", "min" => 1917, "max" => 1956],
        "от 5 до 7 млн" => ["units" => "Год", "min" => 1918, "max" => 1976],
        "от 7 до 9 млн" => ["units" => "Год", "min" => 1956, "max" => 1986],
        "от 9 до 11 млн" => [
            "units" => "Год",
            "min" => 1960,
            "max" => 2021,
        ],
        "более 11 млн" => ["units" => "Год", "min" => 1970, "max" => 2021],
    ],
    [
        "attributeName" => "количество этажей в доме",
        "менее 3 млн" => ["units" => "Этаж", "min" => 2, "max" => 5],
        "от 3 до 5 млн" => ["units" => "Этаж", "min" => 2, "max" => 5],
        "от 5 до 7 млн" => ["units" => "Этаж", "min" => 3, "max" => 7],
        "от 7 до 9 млн" => ["units" => "Этаж", "min" => 5, "max" => 16],
        "от 9 до 11 млн" => ["units" => "Этаж", "min" => 7, "max" => 16],
        "более 11 млн" => ["units" => "Этаж", "min" => 11, "max" => 45],
    ],
    [
        "attributeName" => "этаж",
        "менее 3 млн" => ["units" => "Этаж", "min" => 1, "max" => 4],
        "от 3 до 5 млн" => ["units" => "Этаж", "min" => 1, "max" => 5],
        "от 5 до 7 млн" => ["units" => "Этаж", "min" => 1, "max" => 6],
        "от 7 до 9 млн" => ["units" => "Этаж", "min" => 1, "max" => 16],
        "от 9 до 11 млн" => ["units" => "Этаж", "min" => 1, "max" => 16],
        "более 11 млн" => ["units" => "Этаж", "min" => 11, "max" => 45],
    ],
    [
        "attributeName" => "тип планировки",
        "менее 3 млн" => ["Студия"],
        "от 3 до 5 млн" => ["Фиксированная", "Студия"],
        "от 5 до 7 млн" => ["Фиксированная", "Студия"],
        "от 7 до 9 млн" => ["Фиксированная", "Студия"],
        "от 9 до 11 млн" => ["Фиксированная", "Студия"],
        "более 11 млн" => ["Студия", "Фиксированная", "Свободная"],
    ],
    [
        "attributeName" => "число комнат",
        "менее 3 млн" => ["1"],
        "от 3 до 5 млн" => ["1", "2"],
        "от 5 до 7 млн" => ["1", "2"],
        "от 7 до 9 млн" => ["1", "2", "3"],
        "от 9 до 11 млн" => ["1", "2", "3", "4"],
        "более 11 млн" => ["2", "3", "4", "5 и более"],
    ],
    [
        "attributeName" => "площадь",
        "менее 3 млн" => ["units" => "кв.м", "min" => 10, "max" => 40],
        "от 3 до 5 млн" => ["units" => "кв.м", "min" => 15, "max" => 40],
        "от 5 до 7 млн" => ["units" => "кв.м", "min" => 20, "max" => 65],
        "от 7 до 9 млн" => ["units" => "кв.м", "min" => 20, "max" => 80],
        "от 9 до 11 млн" => ["units" => "кв.м", "min" => 35, "max" => 95],
        "более 11 млн" => ["units" => "кв.м", "min" => 40, "max" => 500],
    ],
    [
        "attributeName" => "количество балконов/лоджий",
        "менее 3 млн" => ["units" => "кв.м", "min" => 0, "max" => 0],
        "от 3 до 5 млн" => ["units" => "кв.м", "min" => 0, "max" => 1],
        "от 5 до 7 млн" => ["units" => "кв.м", "min" => 0, "max" => 1],
        "от 7 до 9 млн" => ["units" => "кв.м", "min" => 0, "max" => 2],
        "от 9 до 11 млн" => ["units" => "кв.м", "min" => 1, "max" => 3],
        "более 11 млн" => ["units" => "кв.м", "min" => 1, "max" => 4],
    ],
    [
        "attributeName" => "состояние ремонта в квартире",
        "менее 3 млн" => ["units" => "Балл", "min" => 0, "max" => 3],
        "от 3 до 5 млн" => ["units" => "Балл", "min" => 1, "max" => 5],
        "от 5 до 7 млн" => ["units" => "Балл", "min" => 1, "max" => 7],
        "от 7 до 9 млн" => ["units" => "Балл", "min" => 2, "max" => 10],
        "от 9 до 11 млн" => ["units" => "Балл", "min" => 2, "max" => 10],
        "более 11 млн" => ["units" => "Балл", "min" => 0, "max" => 10],
    ],
    [
        "attributeName" => "наличие мебели и бытовой техники",
        "менее 3 млн" => ["Среднее наполнение", "Полный комплект"],
        "от 3 до 5 млн" => [
            "Минимальное количество",
            "Среднее наполнение",
            "Полный комплект",
        ],
        "от 5 до 7 млн" => [
            "Отсутствует",
            "Минимальное количество",
            "Среднее наполнение",
        ],
        "от 7 до 9 млн" => [
            "Отсутствует",
            "Минимальное количество",
            "Среднее наполнение",
            "Полный комплект ",
        ],
        "от 9 до 11 млн" => [
            "Отсутствует",
            "Минимальное количество",
            "Среднее наполнение",
            "Полный комплект ",
        ],
        "более 11 млн" => [
            "Отсутствует",
            "Минимальное количество",
            "Среднее наполнение",
            "Полный комплект ",
        ],
    ],
    [
        "attributeName" => "наличие благоустроенной придомовой территории",
        "менее 3 млн" => ["Нет"],
        "от 3 до 5 млн" => ["Нет"],
        "от 5 до 7 млн" => ["Нет"],
        "от 7 до 9 млн" => ["Да", "Нет"],
        "от 9 до 11 млн" => ["Да", "Нет"],
        "более 11 млн" => ["Да"],
    ],
    [
        "attributeName" => "количество детских садов в радиусе 1км",
        "менее 3 млн" => ["units" => "Штук", "min" => 0, "max" => 1],
        "от 3 до 5 млн" => ["units" => "Штук", "min" => 0, "max" => 2],
        "от 5 до 7 млн" => ["units" => "Штук", "min" => 1, "max" => 2],
        "от 7 до 9 млн" => ["units" => "Штук", "min" => 1, "max" => 2],
        "от 9 до 11 млн" => ["units" => "Штук", "min" => 2, "max" => 4],
        "более 11 млн" => ["units" => "Штук", "min" => 3, "max" => 5],
    ],
    [
        "attributeName" => "количество школ в радиусе 1км",
        "менее 3 млн" => ["units" => "Штук", "min" => 0, "max" => 1],
        "от 3 до 5 млн" => ["units" => "Штук", "min" => 0, "max" => 2],
        "от 5 до 7 млн" => ["units" => "Штук", "min" => 0, "max" => 1],
        "от 7 до 9 млн" => ["units" => "Штук", "min" => 1, "max" => 3],
        "от 9 до 11 млн" => ["units" => "Штук", "min" => 2, "max" => 4],
        "более 11 млн" => ["units" => "Штук", "min" => 3, "max" => 5],
    ],
];

    public function load(ObjectManager $manager): void
    {
        foreach (PriceClassesFixtures::PRICECLASSES as $priceClassName) { 
            $priceClass = $this->getReference($priceClassName);
            foreach($this::PRICECLASSES_ATTRIBUTES as $priceClassAttribute) { 
                $attribute = $this->getReference($priceClassAttribute['attributeName']);
                $priceClassAttributeEntity = new PriceClassAttribute();
                $priceClassAttributeEntity->setAttribute($attribute);
                $priceClassAttributeEntity->setValue($priceClassAttribute[$priceClassName]);
                $manager->persist($priceClassAttributeEntity);
                $priceClass->addPriceClassAttribute($priceClassAttributeEntity);
            }
        }

        $manager->flush();
    }

    public function getDependencies()
    {
        return [
            AttributesFixtures::class,
            PriceClassesFixtures::class,
        ];
    }
}