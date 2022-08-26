import { NextPage } from "next";
import styles from "../../styles/CarsList.module.css";
import { useQuery, QueryClient, QueryClientProvider } from "react-query";
import { FunctionComponent, useState } from "react";
import CarCard, { CarListInterface } from "../../components/CarCard";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export interface PaginationInterface {
  total: number;
  currentPagte: number;
  pageSize: number;
}

const queryClient = new QueryClient();

const Cars: NextPage = () => (
  <QueryClientProvider client={queryClient}>
    <CarsContent />
  </QueryClientProvider>
);

const CarsContent: FunctionComponent = () => {
  const [page, setPage] = useState<number>(1);
  const {
    isLoading,
    isError,
    data: cars,
    error,
    refetch,
  } = useQuery(
    ["cars", page],
    async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/inventory/car/search`
      );
      const cars = await res
        .json()
        .then(
          (value: {
            result: CarListInterface[];
            pagination: PaginationInterface;
          }) => value.result
        )
        .catch((error: any) => console.log(error));

      return cars;
    },
    { keepPreviousData: true }
  );

  return (
    <div className={styles.carsList}>
      <h2 className={styles.title}>Toutes les voitures</h2>
      <div className={styles.content}>
        {!isLoading &&
          !isError &&
          cars?.map((car) => <CarCard key={car.id} car={car} />)}
        {isLoading &&
          [...Array(12)].map((i) => (
            <Skeleton
              key={i}
              width={300}
              height={271}
              style={{ margin: "20px", borderRadius: "2px" }}
            />
          ))}
        {isError && !isLoading && "Une Erreur est produite"}
      </div>
    </div>
  );
};

export default Cars;
