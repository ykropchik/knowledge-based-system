<?php

namespace App\Entity;

use App\Entity\PriceClassAttribute;
use App\Repository\PriceClassRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass=PriceClassRepository::class)
 */
class PriceClass
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $name;

    /**
     * @ORM\ManyToMany(targetEntity=PriceClassAttribute::class)
     */
    private $priceClassAttributes;

    public function __construct()
    {
        $this->priceClassAttributes = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): self
    {
        $this->name = $name;

        return $this;
    }

    /**
     * @return Collection<int, PriceClassAttribute>
     */
    public function getPriceClassAttributes(): Collection
    {
        return $this->priceClassAttributes;
    }

    public function addPriceClassAttribute(PriceClassAttribute $priceClassAttribute): self
    {
        if (!$this->priceClassAttributes->contains($priceClassAttribute)) {
            $this->priceClassAttributes[] = $priceClassAttribute;
        }

        return $this;
    }

    public function removePriceClassAttribute(PriceClassAttribute $priceClassAttribute): self
    {
        $this->priceClassAttributes->removeElement($priceClassAttribute);

        return $this;
    }

    public function removeObsoleteAttributes($em, array $newAttributes): self
    {
        $priceClassAttributes = $this->getPriceClassAttributes();
        $attributesForDeleting = [];

        foreach ($priceClassAttributes as $priceClassAttribute) {
            $attribute = $priceClassAttribute->getAttribute();

            if (!in_array($attribute, $newAttributes)) {
                $attributesForDeleting[] = $priceClassAttribute;
            }
        }

        foreach ($attributesForDeleting as $attributeForDeleting) {
            $this->removePriceClassAttribute($attributeForDeleting);
            $em->remove($attributeForDeleting);
        }

        $em->persist($this);
        $em->flush();

        return $this;
    }

    public function addNewAttributes($em, array $attributes): self
    {
        $priceClassAttributes = $this->getPriceClassAttributes();
        $attributesForDeleting = [];

        foreach ($priceClassAttributes as $priceClassAttribute) {
            $attribute = $priceClassAttribute->getAttribute();

            if (($key = array_search($attribute, $attributes)) !== false) {
                unset($attributes[$key]);
            }
        }

        foreach ($attributes as $attribute) {
            $newPriceClassAttribute = new PriceClassAttribute();
            $newPriceClassAttribute->setAttribute($attribute);
            $this->addPriceClassAttribute($newPriceClassAttribute);
            $em->persist($newPriceClassAttribute);
        }

        $em->persist($this);
        $em->flush();
        
        return $this;
    }
}
