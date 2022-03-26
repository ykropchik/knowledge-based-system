<?php

namespace App\Repository;

use App\Entity\PriceClassAttribute;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\ORM\OptimisticLockException;
use Doctrine\ORM\ORMException;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method PriceClassAttribute|null find($id, $lockMode = null, $lockVersion = null)
 * @method PriceClassAttribute|null findOneBy(array $criteria, array $orderBy = null)
 * @method PriceClassAttribute[]    findAll()
 * @method PriceClassAttribute[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class PriceClassAttributeRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, PriceClassAttribute::class);
    }

    /**
     * @throws ORMException
     * @throws OptimisticLockException
     */
    public function add(PriceClassAttribute $entity, bool $flush = true): void
    {
        $this->_em->persist($entity);
        if ($flush) {
            $this->_em->flush();
        }
    }

    /**
     * @throws ORMException
     * @throws OptimisticLockException
     */
    public function remove(PriceClassAttribute $entity, bool $flush = true): void
    {
        $this->_em->remove($entity);
        if ($flush) {
            $this->_em->flush();
        }
    }

    // /**
    //  * @return PriceClassAttribute[] Returns an array of PriceClassAttribute objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('p')
            ->andWhere('p.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('p.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?PriceClassAttribute
    {
        return $this->createQueryBuilder('p')
            ->andWhere('p.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
