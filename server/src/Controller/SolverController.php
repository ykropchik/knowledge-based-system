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
 * @Route("/solver", name="app_solver")
 */
class SolverController extends ApiController
{
    private PriceClassRepository $priceClassRepository;
    private EntityManagerInterface $em;

    public function __construct(PriceClassRepository $priceClassRepository, EntityManagerInterface $em){
        $this->priceClassRepository = $priceClassRepository;
        $this->em = $em;
    }

    /**
     * @Route("", name="solve", methods={"POST"})
     */
    public function solve(SerializerInterface $serializer, Request $request): JsonResponse
    {
        try {
            $request = $this->transformJsonBody($request);
            $inputData = $request->get('data');

            $priceClasses = $this->priceClassRepository->findAll();
            $result = $priceClasses;

            for ($i=0; $i < count($priceClasses); $i++) { 
                $attributesArray = [];

                if (count($priceClasses[$i]->getPriceClassAttributes()) == 0) {
                    unset($result[$i]);
                    continue;
                }

                foreach ($priceClasses[$i]->getPriceClassAttributes() as $priceClassAttribute) {
                    $attributesArray[$priceClassAttribute->getAttribute()->getId()] = $priceClassAttribute->getValue();
                }

                foreach ($inputData as $inputAttr) {
                    if (isset($attributesArray[$inputAttr["id"]])) {
                        if (isset($attributesArray[$inputAttr["id"]]["min"])) {
                            if ($attributesArray[$inputAttr["id"]]["min"] > $inputAttr["value"] || $attributesArray[$inputAttr["id"]]["max"] < $inputAttr["value"]) {
                                unset($result[$i]);
                                break;
                            }
                        } else {
                            if (!in_array($inputAttr["value"], $attributesArray[$inputAttr["id"]])) {
                                unset($result[$i]);
                                break;
                            }
                        }
                    }
                }
            }
            
            return $this->response($serializer->serialize(array_values($result), 'json', [AbstractNormalizer::IGNORED_ATTRIBUTES => ['__initializer__', '__cloner__', '__isInitialized__']]));
        } catch (Exception $e) {
            return $this->response(json_encode($e->getMessage()), Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
