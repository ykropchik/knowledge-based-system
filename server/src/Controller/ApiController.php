<?php

namespace App\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Serializer\SerializerInterface;

class ApiController extends AbstractController
{
    public function response($data, $statusCode = Response::HTTP_OK, $headers = []): JsonResponse
    {
        $response = new JsonResponse("{\"result\": {$data}}", $statusCode, $headers, true);
        $response->setEncodingOptions(JSON_UNESCAPED_UNICODE);
        // dd($response);
        return $response;
    }

    public function transformJsonBody(Request $request): Request {
        $data = json_decode($request->getContent(), true);
        if (null === $data) {
            return $request;
        }
        $request->request->replace($data);

        return $request;
    }
}