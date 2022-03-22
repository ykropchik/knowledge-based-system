<?php

namespace App\Controller;

use Exception;
use App\Entity\Attribute;
use App\Repository\AttributeRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;
use Doctrine\ORM\EntityManagerInterface;

/**
 * @Route("/attributes")
 */
class AttributeController extends ApiController
{
    private AttributeRepository $attributeRepository;
    private EntityManagerInterface $em;
    
    public function __construct(AttributeRepository $attributeRepository, EntityManagerInterface $em){
        $this->attributeRepository = $attributeRepository;
        $this->em = $em;
    }

    /**
     * @Route("/get", name="get_attributes", methods={"GET"})
     */
    public function getAttributes(SerializerInterface $serializer): JsonResponse
    {
        try {
            $attributes = $this->attributeRepository->findAll();
            $result = $serializer->serialize($attributes, 'json');
            
            return $this->response($result);
        } catch (Exception $e) {
            return $this->response(json_encode($e->getMessage()), Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * @Route("/add", name="add_attribute", methods={"POST"})
     */
    public function addAttribute(SerializerInterface $serializer, Request $request): JsonResponse
    {
        try {
            $attribute = new Attribute();

            $request = $this->transformJsonBody($request);

            $name = $request->request->get('name');

            if ($this->attributeRepository->findBy(['name' => $name])) {
                return $this->response(json_encode("Attribute with this name already exist!"), Response::HTTP_CONFLICT);
            }

            $attribute->setName($name);

            $this->em->persist($attribute);
            $this->em->flush();
            
            return $this->getAttributes($serializer);
        } catch (Exception $e) {
            return $this->response(json_encode($e->getMessage()), Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * @Route("/remove/{id}", name="remove_attribute")
     */
    public function removeAttribute(SerializerInterface $serializer, $id): JsonResponse
    {
        try {
            $attribute = $this->attributeRepository->find($id);

            if (!$attribute) {
                return $this->response(json_encode("Invalid attribute id!"), Response::HTTP_BAD_REQUEST);
            }
            
            $this->attributeRepository->remove($attribute);

            return $this->getAttributes($serializer);
        } catch (Exception $e) {
            return $this->response(json_encode($e->getMessage()), Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * @Route("/setValues/{id}", name="set_attribute_value", methods={"PUT"})
     */
    public function setAttributeValues(SerializerInterface $serializer, Request $request, $id): JsonResponse
    {
        try {
            $attribute = $this->attributeRepository->find($id);
            $request = $this->transformJsonBody($request);

            $type = $request->request->get('type');
            $values = $request->request->get('values');

            $attribute->setType($type);
            $attribute->setPossibleValues($values);
            
            $this->em->persist($attribute);
            $this->em->flush();

            return $this->getAttributes($serializer);
        } catch (Exception $e) {
            return $this->response(json_encode($e->getMessage()), Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
