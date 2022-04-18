<?php

namespace App\DataFixtures;

use App\Entity\Attribute;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class AttributesFixtures extends Fixture
{
    public const ATTRIBUTES = [
        [
            "name" => "район расположения",
            "type" => "scalar",
            "value" => [
                "Эгершельд",
                "Центр",
                "Первая речка",
                "Вторая речка",
                "Тихая",
                "Чуркин",
            ],
        ],
        [
            "name" => "тип дома",
            "type" => "scalar",
            "value" => ["Кирпичный", "Блочный", "Панельный", "Монолитный"],
        ],
        [
            "name" => "тип объекта",
            "type" => "scalar",
            "value" => ["Новостройка", "Вторичка"],
        ],
        [
            "name" => "год постройки",
            "type" => "range",
            "value" => ["units" => "Год", "min" => 1940, "max" => 2022],
        ],
        [
            "name" => "количество этажей в доме",
            "type" => "range",
            "value" => ["units" => "Этаж", "min" => 2, "max" => 45],
        ],
        [
            "name" => "этаж",
            "type" => "range",
            "value" => ["units" => "Этаж", "min" => 1, "max" => 45],
        ],
        [
            "name" => "тип планировки",
            "type" => "scalar",
            "value" => ["Студия", "Свободная планировка", "Фиксированная"],
        ],
        [
            "name" => "число комнат",
            "type" => "scalar",
            "value" => ["1", "2", "3", "4", "5 и более"],
        ],
        [
            "name" => "площадь",
            "type" => "range",
            "value" => ["units" => "кв. м", "min" => 10, "max" => 500],
        ],
        [
            "name" => "количество балконов/лоджий",
            "type" => "range",
            "value" => ["units" => "Шт", "min" => 0, "max" => 8],
        ],
        [
            "name" => "состояние ремонта в квартире",
            "type" => "range",
            "value" => ["units" => "Балл", "min" => 0, "max" => 10],
        ],
        [
            "name" => "наличие мебели и бытовой техники",
            "type" => "scalar",
            "value" => [
                "Отсутствует",
                "Минимальное количество",
                "Среднее наполнение",
                "Полный комплект",
            ],
        ],
        [
            "name" => "наличие благоустроенной придомовой территории",
            "type" => "bool",
            "value" => ["Да", "Нет"],
        ],
        [
            "name" => "количество детских садов в радиусе 1км",
            "type" => "range",
            "value" => ["units" => "Шт", "min" => 0, "max" => 10],
        ],
        [
            "name" => "количество школ в радиусе 1км",
            "type" => "range",
            "value" => ["units" => "Шт", "min" => 0, "max" => 10],
        ],
    ];

    public function load(ObjectManager $manager): void
    {   
        foreach(self::ATTRIBUTES as $attribute){
            $attributeEntity = new Attribute();
            $attributeEntity->setName($attribute["name"]);
            $attributeEntity->setType($attribute["type"]);
            $attributeEntity->setPossibleValues($attribute["value"]);
            $manager->persist($attributeEntity);
            $this->addReference($attribute["name"], $attributeEntity);
        }

        $manager->flush();
    }
}
