<?php

namespace App\Entity;

use App\Repository\PriceClassAttributeRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass=PriceClassAttributeRepository::class)
 */
class PriceClassAttribute
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\ManyToOne(targetEntity=Attribute::class)
     * @ORM\JoinColumn(nullable=false, onDelete="CASCADE")
     */
    private $attribute;

    /**
     * @ORM\Column(type="json", nullable=true)
     */
    private $value = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getAttribute(): ?Attribute
    {
        return $this->attribute;
    }

    public function setAttribute(?Attribute $attribute): self
    {
        $this->attribute = $attribute;

        return $this;
    }

    public function getValue(): ?array
    {
        return $this->value;
    }

    public function setValue(?array $value): self
    {
        $this->value = $value;

        return $this;
    }

    public function removeValue(): self
    {
        $this->value = null;
        
        return $this;
    }
}
