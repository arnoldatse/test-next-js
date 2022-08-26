import { useRouter } from "next/router";
import { PaginationInterface } from "./"
import { CarListInterface } from "../../components/CarCard";

const Cars = () => {
  const router = useRouter();
  const { search } = router.query;

  return <>{search ? search : "dede"}</>;
};

export default Cars;
