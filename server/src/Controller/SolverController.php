<?php

namespace App\Controller;

use App\Repository\PriceClassRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;
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
        $request = $this->transformJsonBody($request);
        dd($request);
        return $this->response($result);
    }
}
