import { NextPage } from "next";
import { PaginationInterface } from "./"
import { useQuery, QueryClient, QueryClientProvider } from "react-query";
import { FunctionComponent, useState } from "react";
import styles from "../../styles/CarsList.module.css";
import CarCard, { CarListInterface } from "../../components/CarCard";
import Skeleton from "react-loading-skeleton";
import { useRouter } from "next/router";

const queryClient = new QueryClient();

const Cars: NextPage = () => (
  <QueryClientProvider client={queryClient}>
    <CarsContent />
  </QueryClientProvider>
);


const CarsContent: FunctionComponent = () => {
  const router = useRouter();
  const { search } = router.query;
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
      <h2 className={styles.title}>{`RESULTS FOR "${search}"`}</h2>
      <div className={styles.content}>
        {!isLoading &&
          !isError &&
          cars?.map((car) => <CarCard key={car.id} car={car} />)}
        {isLoading &&
          [...Array(12)].map((i, index) => (
            <Skeleton
              key={index}
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
