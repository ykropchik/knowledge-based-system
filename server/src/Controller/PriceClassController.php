<?php

namespace App\Controller;

use Exception;
use App\Entity\PriceClass;
use App\Entity\PriceClassAttribute;
use App\Repository\PriceClassRepository;
use App\Repository\AttributeRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Serializer\Normalizer\AbstractNormalizer;
use Doctrine\ORM\EntityManagerInterface;

/**
 * @Route("/priceClasses")
 */
class PriceClassController extends ApiController
{
    private PriceClassRepository $priceClassRepository;
    private EntityManagerInterface $em;

    public function __construct(PriceClassRepository $priceClassRepository, EntityManagerInterface $em){
        $this->priceClassRepository = $priceClassRepository;
        $this->em = $em;
    }

    /**
     * @Route("/get", name="get_price_class", methods={"GET"})
     */
    public function getPriceClasses(SerializerInterface $serializer): JsonResponse
    {
        try {
            $priceClasses = $this->priceClassRepository->findAll();
            $result = $serializer->serialize($priceClasses, 'json', [AbstractNormalizer::IGNORED_ATTRIBUTES => ['__initializer__', '__cloner__', '__isInitialized__']]);

            return $this->response($result);
        } catch (Exception $e) {
            return $this->response(json_encode($e->getMessage()), Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * @Route("/add", name="add_price_class", methods={"POST"})
     */
    public function addPriceClass(SerializerInterface $serializer, Request $request): JsonResponse
    {
        try {
            $priceClass = new PriceClass();

            $request = $this->transformJsonBody($request);

            $name = $request->request->get('name');

            if ($this->priceClassRepository->findBy(['name' => $name])) {
                return $this->response(json_encode("Price class with this name already exist!"), Response::HTTP_CONFLICT);
            }

            $priceClass->setName($name);

            $this->em->persist($priceClass);
            $this->em->flush();

            return $this->getPriceClasses($serializer);
        } catch (Exception $e) {
            return $this->response(json_encode($e->getMessage()), Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * @Route("/remove/{id}", name="remove_price_class", methods={"DELETE"})
     */
    public function removePriceClass(SerializerInterface $serializer, $id): JsonResponse
    {
        try {
            $priceClass = $this->priceClassRepository->find($id);

            if (!$priceClass) {
                return $this->response(json_encode("Invalid price class id!"), Response::HTTP_BAD_REQUEST);
            }
            
            $this->priceClassRepository->remove($priceClass);

            return $this->getPriceClasses($serializer);
        } catch (Exception $e) {
            return $this->response(json_encode($e->getMessage()), Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * @Route("/{id}/setAttributes", name="set_attributes_to_price_class", methods={"PUT"})
     */
    public function setAttributesToPriceClass(
        AttributeRepository $attributeRepository, 
        SerializerInterface $serializer, 
        Request $request, 
        $id): JsonResponse
    {
        try {
            $priceClass = $this->priceClassRepository->find($id);

            if (!$priceClass) {
                return $this->response(json_encode("Invalid price class id!"), Response::HTTP_BAD_REQUEST);
            }

            $request = $this->transformJsonBody($request);
            $attributesId = $request->request->get('attributesId');

            $attributes = [];

            foreach ($attributesId as $id) {
                $attributes[] = $attributeRepository->find($id);
            }

            $priceClass->removeObsoleteAttributes($this->em, $attributes);
            $priceClass->addNewAttributes($this->em, $attributes);

            $this->em->persist($priceClass);
            $this->em->flush();

            return $this->getPriceClasses($serializer);
        } catch (Exception $e) {
            return $this->response(json_encode($e->getMessage()), Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
