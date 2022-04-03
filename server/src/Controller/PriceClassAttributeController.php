<?php

namespace App\Controller;

use App\Repository\PriceClassAttributeRepository;
use App\Repository\PriceClassRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\Normalizer\AbstractNormalizer;
use Doctrine\ORM\EntityManagerInterface;

/**
 * @Route("/priceClassAttribute")
 */
class PriceClassAttributeController extends ApiController
{
    private PriceClassAttributeRepository $priceClassAttributeRepository;
    private PriceClassRepository $priceClassRepository;
    private EntityManagerInterface $em;

    public function __construct(
        PriceClassAttributeRepository $priceClassAttributeRepository,
        PriceClassRepository $priceClassRepository,
        EntityManagerInterface $em)
    {
        $this->priceClassAttributeRepository = $priceClassAttributeRepository;
        $this->priceClassRepository = $priceClassRepository;
        $this->em = $em;
    }

    /**
     * @Route("/setValues", name="set_values", methods={"POST"})
     */
    
    public function setValues(
        SerializerInterface $serializer, 
        Request $request): JsonResponse
    {
        try {
            $request = $this->transformJsonBody($request);
            $data = $request->request->get('data');

            foreach ($data as $item) {
                $priceClassAttribute = $this->priceClassAttributeRepository->find($item['id']);

                $priceClassAttribute->removeValue();
                $priceClassAttribute->setValue($item['value']);
                $this->em->persist($priceClassAttribute);
            }

            $this->em->flush();

            $priceClasses = $this->priceClassRepository->findAll();
            $result = $serializer->serialize($priceClasses, 'json', [AbstractNormalizer::IGNORED_ATTRIBUTES => ['__initializer__', '__cloner__', '__isInitialized__']]);

            return $this->response($result);
        } catch (Exception $e) {
            return $this->response(json_encode($e->getMessage()), Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
