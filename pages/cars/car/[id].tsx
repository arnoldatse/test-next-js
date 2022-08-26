import { NextPage } from "next";
import { useRouter } from "next/router";
import { CarListInterface } from "../../../components/CarCard";
import { PaginationInterface } from "..";
import styles from "../../../styles/CarDetails.module.css";

export interface CarDetailsInterface {
  id: string;
  carName: string;
  imageUrl: string;
  year: string;
  country: string;
  city: string;
  state: string;
  sellingCondition: string;
  marketplacePrice: number;
  marketplaceOldPrice: number;
  hasWarranty: boolean;
  transmission: string;
  fuelType: string;
  engineType: string;
  interiorColor: string;
  exteriorColor: string;
  bodyType: {
    id: 3;
    name: string;
    imageUrl: string;
  };
}

interface CarMediaInterface {
  id: number;
  name: string;
  url: string;
  type: string;
}

const Cars: NextPage<{
  car: CarDetailsInterface;
  medias: CarMediaInterface;
}> = ({ car, medias }) => {
  return (
    <>
      <div className={styles.content}>
        <div className={styles.infos}>
          <div className={styles.title}>
            <h3>Informations</h3>
          </div>
          <table className={styles.tableInfos}>
            <tbody>
              <tr className={styles.tableTr}>
                <th className={styles.tableTh}>Interior color</th>
                <td className={styles.tableTd}>{car.interiorColor}</td>
              </tr>
              <tr className={`${styles.tableTr}  ${styles.tableTrColored}`}>
                <th className={styles.tableTh}>Exterior color</th>
                <td className={styles.tableTd}>{car.exteriorColor}</td>
              </tr>
              <tr className={`${styles.tableTr}`}>
                <th className={styles.tableTh}>body Type</th>
                <td className={styles.tableTd}>{car.bodyType.name}</td>
              </tr>
              <tr className={`${styles.tableTr} ${styles.tableTrColored}`}>
                <th className={styles.tableTh}>Transmission</th>
                <td className={styles.tableTd}>{car.transmission}</td>
              </tr>
              <tr className={`${styles.tableTr}`}>
                <th className={styles.tableTh}>fuel Type</th>
                <td className={styles.tableTd}>{car.fuelType}</td>
              </tr>
              <tr className={`${styles.tableTr} ${styles.tableTrColored}`}>
                <th className={styles.tableTh}>engine Type</th>
                <td className={styles.tableTd}>{car.engineType}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export async function getStaticPaths() {
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

  const paths = cars?.map((car) => ({
    params: { id: car.id },
  }));

  return { paths, fallback: false };
}

export async function getStaticProps({ params }: { params: { id: string } }) {
  const resCar = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/inventory/car/${params.id}`
  );
  const car = await resCar
    .json()
    .then((value: CarDetailsInterface) => value)
    .catch((error: any) => console.log(error));

  const resMedias = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/inventory/car_media?carId=${params.id}`
  );
  const medias = await resMedias
    .json()
    .then((value: { carMediaList: CarMediaInterface[] }) => value.carMediaList)
    .catch((error: any) => console.log(error));

  return { props: { car, medias } };
}

export default Cars;
