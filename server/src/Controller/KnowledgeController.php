<?php

namespace App\Controller;

use App\Repository\PriceClassRepository;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Serializer\Normalizer\AbstractNormalizer;
use Doctrine\ORM\EntityManagerInterface;

/**
 * @Route("/knowledge")
 */
class KnowledgeController extends ApiController
{
    private PriceClassRepository $priceClassRepository;
    private EntityManagerInterface $em;

    public function __construct(PriceClassRepository $priceClassRepository){
        $this->priceClassRepository = $priceClassRepository;
    }
    /**
     * @Route("/checkCompleteness", name="checkCompleteness", methods={"GET"})
     */
    public function index(SerializerInterface $serializer): Response
    {
        try {
            $priceClasses = $this->priceClassRepository->findAll();

            foreach ($priceClasses as $priceClass) {
                $priceClassAttributes = $priceClass->getPriceClassAttributes();
                
                foreach ($priceClassAttributes as $priceClassAttribute) {
                    $value = $priceClassAttribute->getValue();
                    if (is_null($value) || empty($value)) {
                        return $this->response($serializer->serialize("Not completeness", 'json', [AbstractNormalizer::IGNORED_ATTRIBUTES => ['__initializer__', '__cloner__', '__isInitialized__']]));
                    }
                }
            }

            return $this->response($serializer->serialize("OK", 'json', [AbstractNormalizer::IGNORED_ATTRIBUTES => ['__initializer__', '__cloner__', '__isInitialized__']]));
        } catch (Exception $e) {
            return $this->response(json_encode($e->getMessage()), Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
